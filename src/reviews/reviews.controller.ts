  import { Body, Controller, Delete,Get, Param, Patch, Post, HttpCode, Res,} from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiExtraModels, getSchemaPath, } from '@nestjs/swagger';
  import type { Response } from 'express';
  import { ReviewsService } from './reviews.service';
  import { Review } from './entities/review.entity';
  import { CreateReviewDto } from './dto/create-review.dto';
  import { UpdateReviewDto } from './dto/update-review.dto';
  import { ProblemDetailsDto } from '../common/filter/problem-details.dto';
  
  @ApiTags('Reviews')
@ApiExtraModels(ProblemDetailsDto)
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // LISTER LES APPRÉCIATIONS D'UN ENDROIT
  @Get('places/:placeId/reviews')
  @ApiOperation({
    summary: "Lister les appréciations d'un endroit",
  })
  @ApiParam({
    name: 'placeId',
    description: "Identifiant de l'endroit",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des appréciations de l'endroit",
    type: Review,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Endroit introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  findAllByPlaceId(@Param('placeId') placeId: string): Review[] {
    return this.reviewsService.findAllByPlaceId(placeId);
  }

  // CRÉER UNE APPRÉCIATION
  @Post('places/:placeId/reviews')
  @ApiOperation({
    summary: 'Créer une appréciation pour un endroit',
  })
  @ApiParam({
    name: 'placeId',
    description: "Identifiant de l'endroit à évaluer",
  })
  @ApiResponse({
    status: 201,
    description: 'Appréciation créée avec un en-tête Location',
    type: Review,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Endroit introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async create(
    @Param('placeId') placeId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Review> {
    const review = await this.reviewsService.create(
      placeId,
      createReviewDto,
    );

    response.setHeader('Location', `/api/v1/reviews/${review.id}`);

    return review;
  }

  // CONSULTER UNE APPRÉCIATION
  @Get('reviews/:id')
  @ApiOperation({
    summary: 'Consulter une appréciation par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'appréciation",
  })
  @ApiResponse({
    status: 200,
    description: 'Appréciation trouvée',
    type: Review,
  })
  @ApiResponse({
    status: 404,
    description: 'Appréciation introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  findOne(@Param('id') id: string): Review {
    return this.reviewsService.findOne(id);
  }

  // MODIFIER UNE APPRÉCIATION
  @Patch('reviews/:id')
  @ApiOperation({
    summary: 'Modifier partiellement une appréciation',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'appréciation à modifier",
  })
  @ApiResponse({
    status: 200,
    description: 'Appréciation modifiée',
    type: Review,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Appréciation introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  // SUPPRIMER UNE APPRÉCIATION
  @Delete('reviews/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Supprimer une appréciation',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'appréciation à supprimer",
  })
  @ApiResponse({
    status: 204,
    description: 'Appréciation supprimée sans contenu',
  })
  @ApiResponse({
    status: 404,
    description: 'Appréciation introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.reviewsService.remove(id);
  }
}