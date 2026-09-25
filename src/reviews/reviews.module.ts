import { Module } from '@nestjs/common';
import { PlacesModule } from '../places/places.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PlacesModule, PersistenceModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}