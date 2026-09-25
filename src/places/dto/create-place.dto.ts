import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, ArrayUnique, MinLength, MaxLength } from 'class-validator';
import { PlaceCategory, PlaceStatus } from '../entities/place.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreatePlaceDto {
    @ApiProperty({
      description: "Nom de l'endroit",
      example: 'Bibliothèque principale',
      minLength: 2,
      maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    name!: string;
  
    @ApiProperty({
      description: "Description de l'endroit",
      example: 'Espace calme pour étudier',
      minLength: 5,
      maxLength: 500,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(500)
    description!: string;
  
    @ApiProperty({
      description: "Catégorie de l'endroit",
      enum: PlaceCategory,
      example: PlaceCategory.LIBRARY,
    })
    @IsEnum(PlaceCategory)
    category!: PlaceCategory;
  
    @ApiProperty({
      description: "Emplacement de l'endroit",
      example: 'Pavillon A',
      maxLength: 200,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    address!: string;
  
    @ApiPropertyOptional({
      description: 'Services disponibles',
      example: ['WIFI', 'POWER_OUTLETS'],
      type: [String],
      uniqueItems: true,
      default: [],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @ArrayUnique()
    services?: string[];
  
    @ApiPropertyOptional({
      description: "État de l'endroit",
      enum: PlaceStatus,
      example: PlaceStatus.ACTIVE,
      default: PlaceStatus.ACTIVE,
    })
    @IsOptional()
    @IsEnum(PlaceStatus)
    status?: PlaceStatus;
  }