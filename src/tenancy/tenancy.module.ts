import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { createDBIfNotExists } from '../typeorm.config';

// Global object to store the connections
const dataSources: { [key: string]: DataSource } = {};

export const TENANT_DATA_SOURCE = Symbol('TENANT_DATA_SOURCE');

const dataSourceFactory = {
  provide: TENANT_DATA_SOURCE, // is a symbol
  scope: Scope.REQUEST,
  useFactory: async (request: Request, jwtService: JwtService) => {
    // Probably there's a better way than verifying using JwtService here..
    const userId = jwtService.verify(
      request.headers['authorization'].split(' ')[1],
      {
        secret: process.env.JWT_SECRET,
      },
    ).userId;

    const tenantUserId = userId;

    if (tenantUserId) {
      return getTenantDataSource(tenantUserId); // find and return a connection
    }

    return null;
  },
  inject: [REQUEST, JwtService], // use `request-scoped` for all usages
};

@Global()
@Module({
  providers: [dataSourceFactory, JwtService],
  exports: [TENANT_DATA_SOURCE],
})
export class TenancyModule {}

export async function getTenantDataSource(
  tenantUserId: string,
): Promise<DataSource> {
  const dataSourceName = `tenant_${tenantUserId}`;

  if (dataSources[dataSourceName]) return dataSources[dataSourceName];

  // If the connection does not exist, create a new one
  await createDBIfNotExists(dataSourceName);

  const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_BASE_URL + dataSourceName,
    entities: ['dist/**/*/task.entity{.ts,.js}'],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  };

  let dataSource = new DataSource(dataSourceOptions);

  dataSource = await dataSource.initialize();

  // Store the connection in the global object
  dataSources[dataSourceName] = dataSource;

  return dataSource;
}
