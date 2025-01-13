import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roleDecorator';
import { UserRole } from 'src/common/entity/userRoleEnum';
import { AuthenticationGuard } from 'src/users/guard/authenticationGuard';
import { AddNewProductDTO } from './dtos/addNewProductDTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploaderService } from 'src/file-uploader/file-uploader.service';

@Controller('products')
export class ProductsController {
  constructor(
    private productService: ProductsService,
    private fileUploaderService: FileUploaderService,
  ) {}
  // Endpoints for Products :-

  //  /products :- Get all products

  @Get('getAllProducts')
  @UseGuards(AuthenticationGuard)
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  //  /products/:id  :- get Product by ID

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  // /poducts  :- Add new Product using seller ONLY
  @Post('addNewProduct')
  @UseGuards(AuthenticationGuard)
  @Roles(UserRole.SELLER)
  @UseInterceptors(
    FileInterceptor('imageUrl', {
      storage: FileUploaderService.getDiskStorage(),
      limits: {
        fileSize: 3 * 1024 * 1024,
      },
    }),
  )
  addNewProduct(
    @Body() addNewProductDTO: AddNewProductDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.addNewProduct(addNewProductDTO, file);
  }

  // /productsOfSeller/:sellerId :- Fetching all the products of a particular seller :-
  @Get('/sellerProducts/:sellerId')
  @UseGuards(AuthenticationGuard)
  @Roles(UserRole.ADMIN)
  fetchSellerProduct(@Param('sellerId') sellerId: string) {
    return this.productService.getAllSellerProduct(sellerId);
  }

  //  /products/:id :- update product details by Admin or the seller of the products

  // /products/:id :- delete product details by admin or the seller of the products
}
