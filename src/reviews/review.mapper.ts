import { Review } from './entities/review.entity';
import { Review as ReviewSchemaModel } from './schemas/review.schema';

export function toReview(document: ReviewSchemaModel): Review {
  return {
    id: document.id,
    placeId: document.placeId,
    authorName: document.authorName,
    rating: document.rating,
    comment: document.comment,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
