import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { PersistenceModule } from '../persistence/persistence.module';
import { Place, PlaceSchema } from './schemas/place.schema';

@Module({
  imports: [
    PersistenceModule,
    MongooseModule.forFeature([{ name: Place.name, schema: PlaceSchema }]),
  ],
  controllers: [PlacesController],
  providers: [PlacesService],
  exports: [PlacesService],
})
export class PlacesModule {}
