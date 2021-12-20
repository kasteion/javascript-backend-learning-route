import { IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
