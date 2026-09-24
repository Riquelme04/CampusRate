import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ArrayUnique, MinLength, MaxLength } from 'class-validator';
import { PlaceCategory, PlaceStatus } from '../entities/place.entity';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(500)
  description!: string;

  @IsEnum(PlaceCategory)
  category!: PlaceCategory;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  address!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  services?: string[];

  @IsOptional()
  @IsEnum(PlaceStatus)
  status?: PlaceStatus;
}
