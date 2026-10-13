import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
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

  // LISTER LES APPRÉCIATIONS D'UNe place
  @Get('places/:placeId/reviews')
  @ApiOperation({
    summary: "Lister les reviews d'une place",
  })
  @ApiParam({
    name: 'placeId',
    description: 'Identifiant de la place',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des reviews de la place',
    type: Review,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Place introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async findAllByPlaceId(@Param('placeId') placeId: string): Promise<Review[]> {
    return this.reviewsService.findAllByPlaceId(placeId);
  }

  // CRÉER UNE review
  @Post('places/:placeId/reviews')
  @ApiOperation({
    summary: 'Créer une review pour un endroit',
  })
  @ApiParam({
    name: 'placeId',
    description: "Identifiant de l'endroit à évaluer",
  })
  @ApiResponse({
    status: 201,
    description: 'review créée avec un en-tête Location',
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
    description: 'Place introuvable',
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
    const review = await this.reviewsService.create(placeId, createReviewDto);

    response.setHeader('Location', `/api/v1/reviews/${review.id}`);

    return review;
  }

  // CONSULTER UNE review
  @Get('reviews/:id')
  @ApiOperation({
    summary: 'Consulter une review par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant du review',
  })
  @ApiResponse({
    status: 200,
    description: 'review trouvée',
    type: Review,
  })
  @ApiResponse({
    status: 404,
    description: 'review introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  // MODIFIER UNe review
  @Patch('reviews/:id')
  @ApiOperation({
    summary: 'Modifier partiellement une review',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant du review à modifier',
  })
  @ApiResponse({
    status: 200,
    description: 'review modifiée',
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
    description: 'review introuvable',
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

  // SUPPRIMER Une review
  @Delete('reviews/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Supprimer une review',
  })
  @ApiParam({
    name: 'id',
    description: 'Identifiant du review à supprimer',
  })
  @ApiResponse({
    status: 204,
    description: 'review supprimée sans contenu',
  })
  @ApiResponse({
    status: 404,
    description: 'review introuvable',
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
