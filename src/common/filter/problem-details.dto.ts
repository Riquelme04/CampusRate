import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ example: 'about:blank' })
  type!: string;

  @ApiProperty({ example: 'Ressource introuvable' })
  title!: string;

  @ApiProperty({ example: 404 })
  status!: number;

  @ApiProperty({ example: 'ID 123 pas trouvé' })
  detail!: string;

  @ApiProperty({ example: '/api/v1/places/123' })
  instance!: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Messages supplémentaires de validation',
  })
  errors?: string[];
}