import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({
    description: "Identifiant de l'appréciation",
  })
  id: string;

  @ApiProperty({
    description: "Identifiant de l'endroit évalué",
  })
  placeId: string;

  @ApiProperty({
    description: "Nom de l'auteur",
    example: 'Jonathan',
  })
  authorName: string;

  @ApiProperty({
    description: 'Note attribuée entre 1 et 5',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  rating: number;

  @ApiProperty({
    description: "Commentaire sur l'endroit",
    example: 'Très bon endroit pour étudier',
  })
  comment: string;

  @ApiProperty({
    description: 'Date de création',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date de dernière modification',
    format: 'date-time',
  })
  updatedAt: string;
}