import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FileUploaderModule } from 'src/file-uploader/file-uploader.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, FileUploaderModule, UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
