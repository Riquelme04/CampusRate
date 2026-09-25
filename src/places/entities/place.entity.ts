import { ApiProperty } from '@nestjs/swagger';

export enum PlaceCategory {
  STUDY_SPACE = 'STUDY_SPACE',
  LIBRARY = 'LIBRARY',
  FOOD_SERVICE = 'FOOD_SERVICE',
  SPORTS = 'SPORTS',
  STUDENT_SERVICE = 'STUDENT_SERVICE',
  COMPUTER_LAB = 'COMPUTER_LAB',
  OTHER = 'OTHER',
}

export enum PlaceStatus {
  ACTIVE = 'ACTIVE',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
  INACTIVE = 'INACTIVE',
}

export class Place {
  @ApiProperty({ description: "Identifiant de l'endroit" })
  id: string;

  @ApiProperty({ example: 'Bibliothèque principale' })
  name: string;

  @ApiProperty({ example: 'Espace calme pour étudier' })
  description: string;

  @ApiProperty({ enum: PlaceCategory })
  category: PlaceCategory;

  @ApiProperty({ example: 'Pavillon A' })
  address: string;

  @ApiProperty({
    type: [String],
    example: ['WIFI', 'POWER_OUTLETS'],
  })
  services: string[];

  @ApiProperty({ enum: PlaceStatus })
  status: PlaceStatus;

  @ApiProperty({
    type: Number,
    nullable: true,
    example: 4.5,
    description: 'Moyenne des appréciations',
  })
  averageRating: number | null;

  @ApiProperty({
    example: 2,
    description: "Nombre d'appréciations",
  })
  reviewCount: number;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}