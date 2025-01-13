import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDTO } from './dtos/createCategoryDTO';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}
  // Create new Category :-
  async createNewCategory(categoryDetails: CreateCategoryDTO) {
    try {
      const { name } = categoryDetails;

      if (!name) {
        throw new BadRequestException('Category Name is required');
      }

      const newCategory = await this.prismaService.category.create({
        data: {
          name,
        },
      });

      if (!newCategory) {
        throw new InternalServerErrorException('Category could not get added');
      }

      return {
        message: 'New Category Added',
        newCategory,
      };
    } catch (error) {
      new InternalServerErrorException();
      throw error;
    }
  }
}
