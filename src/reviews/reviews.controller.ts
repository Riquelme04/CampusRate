import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('places/:placeId/reviews')
  findAllByPlaceId(@Param('placeId') placeId: string): Review[] {
    return this.reviewsService.findAllByPlaceId(placeId);
  }

  @Post('places/:placeId/reviews')
  create(
    @Param('placeId') placeId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Res({ passthrough: true }) response: Response,
  ): Review {
    const review = this.reviewsService.create(placeId, createReviewDto);

    response.setHeader('Location', `/api/v1/reviews/${review.id}`);

    return review;
  }

  @Get('reviews/:id')
  findOne(@Param('id') id: string): Review {
    return this.reviewsService.findOne(id);
  }

  @Patch('reviews/:id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Review {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete('reviews/:id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    this.reviewsService.remove(id);
  }
}
