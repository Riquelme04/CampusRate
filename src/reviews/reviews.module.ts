import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesModule } from '../places/places.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    PlacesModule,
    PersistenceModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
