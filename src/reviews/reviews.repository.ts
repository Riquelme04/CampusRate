import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<Review>,
  ) {}

  async findById(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findOne({ id }).exec();
  }

  async findAllByPlaceId(placeId: string): Promise<ReviewDocument[]> {
    return this.reviewModel
      .find({ placeId })
      .sort({ createdAt: 1, id: 1 })
      .exec();
  }

  async countByPlaceId(placeId: string): Promise<number> {
    return this.reviewModel.countDocuments({ placeId }).exec();
  }

  async create(placeId: string, dto: CreateReviewDto): Promise<ReviewDocument> {
    return this.reviewModel.create({
      placeId,
      authorName: dto.authorName,
      rating: dto.rating,
      comment: dto.comment,
    });
  }

  async updateById(
    id: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDocument | null> {
    const changes: Partial<Pick<Review, 'authorName' | 'rating' | 'comment'>> =
      {};

    if (dto.authorName !== undefined) changes.authorName = dto.authorName;
    if (dto.rating !== undefined) changes.rating = dto.rating;
    if (dto.comment !== undefined) changes.comment = dto.comment;

    return this.reviewModel
      .findOneAndUpdate(
        { id },
        { $set: changes },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.reviewModel.findOneAndDelete({ id }).exec();
  }
}
