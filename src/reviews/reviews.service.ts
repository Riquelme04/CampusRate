import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PlacesService } from '../places/places.service';

@Injectable()
export class ReviewsService {
  private readonly reviews: Review[] = [];

  constructor(private readonly placesService: PlacesService) {}

  findAllByPlaceId(placeId: string): Review[] {
    this.placesService.findOne(placeId);

    return this.reviews.filter((review) => review.placeId === placeId);
  }

  findOne(id: string): Review {
    const review = this.reviews.find((review) => review.id === id);

    if (!review) {
      throw new NotFoundException(`Review ID ${id} pas trouvé`);
    }

    return review;
  }

  create(placeId: string, createReviewDto: CreateReviewDto): Review {
    const place = this.placesService.findOne(placeId);
    const now = new Date().toISOString();

    const review: Review = {
      id: randomUUID(),
      placeId: placeId,
      authorName: createReviewDto.authorName,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      createdAt: now,
      updatedAt: now,
    };

    this.reviews.push(review);

    let moyenne = place.averageRating;

    if (moyenne === null) {
      moyenne = 0;
    }

    place.averageRating =
      (moyenne * place.reviewCount + review.rating) / (place.reviewCount + 1);

    place.reviewCount++;

    return review;
  }

  update(id: string, updateReviewDto: UpdateReviewDto): Review {
    const review = this.findOne(id);
    const place = this.placesService.findOne(review.placeId);

    const ancienneNote = review.rating;

    Object.assign(review, updateReviewDto);
    review.updatedAt = new Date().toISOString();

    let moyenne = place.averageRating;

    if (moyenne === null) {
      moyenne = 0;
    }

    if (updateReviewDto.rating !== undefined) {
      place.averageRating =
        (moyenne * place.reviewCount - ancienneNote + review.rating) /
        place.reviewCount;
    }

    return review;
  }

  remove(id: string): void {
    const review = this.findOne(id);
    const place = this.placesService.findOne(review.placeId);

    let moyenne = place.averageRating;

    if (moyenne === null) {
      moyenne = 0;
    }

    const totalNotes = moyenne * place.reviewCount - review.rating;

    const index = this.reviews.indexOf(review);
    this.reviews.splice(index, 1);

    place.reviewCount--;

    if (place.reviewCount === 0) {
      place.averageRating = null;
    } else {
      place.averageRating = totalNotes / place.reviewCount;
    }
  }
}
