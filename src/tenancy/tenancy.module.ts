// import { Global, Module, NotFoundException, Scope } from '@nestjs/common';
// import { REQUEST } from '@nestjs/core';
// import { Connection, createConnection, getConnectionManager } from 'typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
// import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

// // @Module({})
// // export class TenancyModule {}

// const CONNECTION = Symbol('TENANT_CONNECTION');

// const connectionFactory = {
//   provide: CONNECTION,
//   scope: Scope.REQUEST,
//   useFactory: async (request: Request) => {
//     // get schema id from a header as project id
//     const tenantId = getTenantId(request);

//     if (tenantId) {
//       return getTenantConnection(tenantId); // find and return a connection
//     }

//     return null;
//   },
//   inject: [REQUEST], // use `request-scoped` for all usages
// };

// @Global()
// @Module({
//   providers: [connectionFactory],
//   exports: [CONNECTION],
// })
// export class TenancyModule {}

// export async function getTenantConnection(
//   tenantId: string,
// ): Promise<Connection> {
//   const connectionName = `tenant_${tenantId}`;
//   const connectionManager = getConnectionManager();

//   // cache hit
//   if (connectionManager.has(connectionName)) {
//     const conn = connectionManager.get(connectionName);

//     return conn.isConnected ? conn : conn.connect();
//   }

//   try {
//     const conn = await createConnection({
//       ...({
//         type: 'postgres',
//         url: `postgresql://postgres:password@localhost:5432/${connectionName}`,
//         entities: ['dist/**/*/*.entity{.ts,.js}'],
//         synchronize: true,
//         namingStrategy: new SnakeNamingStrategy(),
//       } as PostgresConnectionOptions),
//       name: connectionName,
//       schema: connectionName,
//     });

//     return conn;
//   } catch (err) {
//     throw new NotFoundException('project id is not found');
//   }
// }
