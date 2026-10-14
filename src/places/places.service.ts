import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ListPlacesQueryDto } from './dto/list-places-query.dto';
import { PlacesRepository } from './places.repository';
import { ReviewsRepository } from '../reviews/reviews.repository';
import { toPlace } from './place.mapper';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepository: PlacesRepository,
    private readonly reviewsRepository: ReviewsRepository,
  ) {}

  async findOne(id: string): Promise<Place> {
    const document = await this.placesRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Endroit ID ${id} pas trouvé`);
    }

    return toPlace(document);
  }

  async findAll(): Promise<Place[]> {
    const documents = await this.placesRepository.findAll();
    return documents.map(toPlace);
  }

  async findAllPaginated(query: ListPlacesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const documents = await this.placesRepository.findPaginated(
      page,
      limit,
      query.category,
    );

    const totalItems = await this.placesRepository.count(query.category);

    return {
      data: documents.map(toPlace),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async create(dto: CreatePlaceDto): Promise<Place> {
    const document = await this.placesRepository.create(dto);
    return toPlace(document);
  }

  async update(id: string, dto: UpdatePlaceDto): Promise<Place> {
    const document = await this.placesRepository.updateById(id, dto);

    if (!document) {
      throw new NotFoundException(`Endroit ID ${id} pas trouvé`);
    }

    return toPlace(document);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    const reviewCount = await this.reviewsRepository.countByPlaceId(id);

    if (reviewCount > 0) {
      throw new ConflictException(
        'Impossible de supprimer un endroit qui possède des reviews',
      );
    }

    await this.placesRepository.deleteById(id);
  }

  async refreshStatistics(placeId: string): Promise<void> {
    const reviews = await this.reviewsRepository.findAllByPlaceId(placeId);
    const reviewCount = reviews.length;

    const averageRating =
      reviewCount === 0
        ? null
        : reviews.reduce((total, review) => total + review.rating, 0) /
          reviewCount;

    await this.placesRepository.updateStatistics(
      placeId,
      averageRating,
      reviewCount,
    );
  }
}
