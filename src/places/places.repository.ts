import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Place, PlaceDocument } from './schemas/place.schema';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceCategory } from './entities/place.entity';

@Injectable()
export class PlacesRepository {
  constructor(
    @InjectModel(Place.name)
    private readonly placeModel: Model<Place>,
  ) {}

  async findAll(): Promise<PlaceDocument[]> {
    return this.placeModel.find().exec();
  }

  async findById(id: string): Promise<PlaceDocument | null> {
    return this.placeModel.findOne({ id }).exec();
  }

  async findPaginated(
    page: number,
    limit: number,
    category?: PlaceCategory,
  ): Promise<PlaceDocument[]> {
    const filter = category === undefined ? {} : { category };

    return this.placeModel
      .find(filter)
      .sort({ createdAt: 1, id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async count(category?: PlaceCategory): Promise<number> {
    const filter = category === undefined ? {} : { category };

    return this.placeModel.countDocuments(filter).exec();
  }

  async create(dto: CreatePlaceDto): Promise<PlaceDocument> {
    return this.placeModel.create({
      name: dto.name,
      description: dto.description,
      category: dto.category,
      address: dto.address,
      services: dto.services ?? [],
      status: dto.status,
    });
  }

  async updateById(
    id: string,
    dto: UpdatePlaceDto,
  ): Promise<PlaceDocument | null> {
    const changes: Partial<
      Pick<
        Place,
        'name' | 'description' | 'category' | 'address' | 'services' | 'status'
      >
    > = {};

    if (dto.name !== undefined) changes.name = dto.name;
    if (dto.description !== undefined) changes.description = dto.description;
    if (dto.category !== undefined) changes.category = dto.category;
    if (dto.address !== undefined) changes.address = dto.address;
    if (dto.services !== undefined) changes.services = dto.services;
    if (dto.status !== undefined) changes.status = dto.status;

    return this.placeModel
      .findOneAndUpdate(
        { id },
        { $set: changes },
        { new: true, runValidators: true },
      )
      .exec();
  }

  async updateStatistics(
    id: string,
    averageRating: number | null,
    reviewCount: number,
  ): Promise<void> {
    await this.placeModel
      .updateOne(
        { id },
        { $set: { averageRating, reviewCount } },
        { runValidators: true },
      )
      .exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.placeModel.findOneAndDelete({ id }).exec();
  }
}
