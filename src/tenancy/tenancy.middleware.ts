// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';

// @Injectable()
// export class TenantMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     // Extract tenant identifier from request (e.g., from headers or URL parameters)
//     const tenantId = req.headers['x-tenant-id']; // Assuming tenant ID is provided in headers

//     // Attach tenant identifier to request object
//     req['tenantId'] = tenantId;

//     next();
//   }
// }
