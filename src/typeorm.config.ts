import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_BASE_URL,
  entities: ['dist/**/*/*.entity{.ts,.js}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const createDBIfNotExists = async (dbName): Promise<void> => {
  const dataSource = new DataSource({
    ...dataSourceOptions,
  });

  await dataSource.initialize();

  const result = await dataSource.query(
    `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
  );

  if (!result.length) {
    console.log(`Creating database with name "${dbName}"`);
    await dataSource.query(`CREATE DATABASE "${dbName}"`);
  }

  await dataSource.destroy();
};
