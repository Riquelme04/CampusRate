import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Place, PlaceStatus } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ListPlacesQueryDto } from './dto/list-places-query.dto';

@Injectable()
export class PlacesService {
  private readonly places: Place[] = [];

  findOne(id: string): Place {
    const place = this.places.find((place) => place.id === id);
    if (!place) {
      throw new NotFoundException(` ID ${id} pas trouvé`);
    }
    return place;
  }

  findAll(): Place[] {
    return this.places;
  }

  findAllPaginated(query: ListPlacesQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const places: Place[] = [];

    for (const place of this.places) {
      if (query.category === undefined || place.category === query.category) {
        places.push(place);
      }
    }

    const totalItems = places.length;
    const totalPages = Math.ceil(totalItems / limit);

    const debut = (page - 1) * limit;
    const data = places.slice(debut, debut + limit);

    return {
      data,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  remove(id: string): void {
    const place = this.findOne(id);

    if (place.reviewCount > 0) {
      throw new ConflictException('Cannot delete a place that has reviews');
    }

    const index = this.places.indexOf(place);
    this.places.splice(index, 1);
  }

  update(id: string, updatePlaceDto: UpdatePlaceDto): Place {
    const place = this.findOne(id);

    Object.assign(place, updatePlaceDto);

    place.updatedAt = new Date().toISOString();

    return place;
  }

  create(createPlaceDto: CreatePlaceDto): Place {
    const now = new Date().toISOString();

    const place: Place = {
      id: randomUUID(),
      name: createPlaceDto.name,
      description: createPlaceDto.description,
      category: createPlaceDto.category,
      address: createPlaceDto.address,
      services: createPlaceDto.services ?? [],
      status: createPlaceDto.status ?? PlaceStatus.ACTIVE,
      averageRating: null,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.places.push(place);

    return place;
  }
}
