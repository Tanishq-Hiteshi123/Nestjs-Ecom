import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddNewProductDTO } from './dtos/addNewProductDTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { userEntity } from 'src/common/entity/userDecoratorEntity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
  ) {}
  async addNewProduct(
    newProductDetails: AddNewProductDTO,
    file: Express.Multer.File,
  ) {
    try {
      const { title, description, categoryId, price, stock } =
        newProductDetails;

      if (!title || !description || !categoryId || !price || !stock) {
        throw new BadRequestException(
          'Please Provide all the necessary details for adding new Product',
        );
      }

      const productImagePath = file?.path;

      if (!productImagePath) {
        throw new BadRequestException(
          'Please Provide the Product Image for adding new Product',
        );
      }
      const newProduct = await this.prismaService.product.create({
        data: {
          title,
          description,
          stock: +stock,
          price: +price,
          categoryId,
          imageUrl: productImagePath,
        },
      });

      return {
        message: 'New Product added ',
        newProduct,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const allProducts = await this.prismaService.product.findMany();

      if (!allProducts) {
        throw new InternalServerErrorException();
      }

      return {
        message: 'All Products',
        allProducts,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('ProductId is not provided');
      }

      const productDetails = await this.prismaService.product.findUnique({
        where: {
          id,
        },
      });

      if (!productDetails) {
        throw new NotFoundException('Product with provided Id not found');
      }

      return {
        message: 'Request Product Id',
        productDetails,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllSellerProduct(sellerId: string) {
    try {
      if (!sellerId) {
        throw new BadRequestException('Seller Id is not provided');
      }

      const sellerDetails =
        await this.userService.getAllIndividualUser(sellerId);

      if (!sellerDetails) {
        throw new NotFoundException('Seller does not found');
      }

      const allProductsAddedByThisSeller =
        await this.prismaService.product.findMany({});

      return {
        message: 'all Products',
        allProductsAddedByThisSeller,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }
}
