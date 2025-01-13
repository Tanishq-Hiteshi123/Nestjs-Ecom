import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCategoryDTO } from './dtos/createCategoryDTO';
import { CategoryService } from './category.service';
import { AuthenticationGuard } from 'src/users/guard/authenticationGuard';
import { Roles } from 'src/common/decorators/roleDecorator';
import { UserRole } from 'src/common/entity/userRoleEnum';

@Controller('category')
export class CategoryController {
  // API for categories :-
  constructor(private categoryService: CategoryService) {}

  // create New Category :-
  @UseGuards(AuthenticationGuard)
  @Roles(UserRole.ADMIN)
  @Post('create')
  createNewCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
    return this.categoryService.createNewCategory(createCategoryDTO);
  }
}
