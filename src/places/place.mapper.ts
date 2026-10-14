import { Place } from './entities/place.entity';
import { Place as PlaceSchemaModel } from './schemas/place.schema';

export function toPlace(document: PlaceSchemaModel): Place {
  return {
    id: document.id,
    name: document.name,
    description: document.description,
    category: document.category,
    address: document.address,
    services: [...document.services],
    status: document.status,
    averageRating: document.averageRating,
    reviewCount: document.reviewCount,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}
