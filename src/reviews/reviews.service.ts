import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PlacesService } from '../places/places.service';
import { ReviewsRepository } from './reviews.repository';
import { toReview } from './review.mapper';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly placesService: PlacesService,
    private readonly reviewsRepository: ReviewsRepository,
  ) {}

  async findAllByPlaceId(placeId: string): Promise<Review[]> {
    await this.placesService.findOne(placeId);

    const documents = await this.reviewsRepository.findAllByPlaceId(placeId);

    return documents.map(toReview);
  }

  async findOne(id: string): Promise<Review> {
    const document = await this.reviewsRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Review ID ${id} pas trouvée`);
    }

    return toReview(document);
  }

  async create(placeId: string, dto: CreateReviewDto): Promise<Review> {
    await this.placesService.findOne(placeId);

    const document = await this.reviewsRepository.create(placeId, dto);

    await this.placesService.refreshStatistics(placeId);

    return toReview(document);
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    await this.placesService.findOne(review.placeId);

    const document = await this.reviewsRepository.updateById(id, dto);

    if (!document) {
      throw new NotFoundException(`Review ID ${id} pas trouvée`);
    }

    await this.placesService.refreshStatistics(review.placeId);

    return toReview(document);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.placesService.findOne(review.placeId);

    await this.reviewsRepository.deleteById(id);
    await this.placesService.refreshStatistics(review.placeId);
  }
}
