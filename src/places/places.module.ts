import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PlacesRepository } from './places.repository';
import { Place, PlaceSchema } from './schemas/place.schema';
import { ReviewsRepository } from '../reviews/reviews.repository';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Place.name, schema: PlaceSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepository, ReviewsRepository],
  exports: [PlacesService, ReviewsRepository],
})
export class PlacesModule {}
