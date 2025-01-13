import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/responseInterceptor';
import { FileUploaderModule } from './file-uploader/file-uploader.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AuthorizationGuard } from './users/guard/authorizationGuard';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
@Module({
  imports: [
    PrismaModule,
    UsersModule,
    FileUploaderModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/public',
    }),
    AdminModule,
    ProductsModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
