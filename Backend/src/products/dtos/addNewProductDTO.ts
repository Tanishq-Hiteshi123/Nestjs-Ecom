import { IsNumber, IsString } from 'class-validator';

export class AddNewProductDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsString()
  stock: string;

  @IsString()
  categoryId: string;
}
