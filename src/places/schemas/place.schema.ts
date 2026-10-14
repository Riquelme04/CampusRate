import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { PlaceCategory, PlaceStatus } from '../entities/place.entity';

export type PlaceDocument = HydratedDocument<Place>;

@Schema({
  timestamps: true,
  id: false,
})
export class Place {
  @Prop({
    type: String,
    required: true,
    default: randomUUID,
    unique: true,
    immutable: true,
  })
  id!: string;

  @Prop({ required: true, minlength: 2, maxlength: 100 })
  name!: string;

  @Prop({ required: true, minlength: 5, maxlength: 500 })
  description!: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PlaceCategory),
  })
  category!: PlaceCategory;

  @Prop({ required: true, maxlength: 200 })
  address!: string;

  @Prop({ type: [String], default: [] })
  services!: string[];

  @Prop({
    type: String,
    enum: Object.values(PlaceStatus),
    default: PlaceStatus.ACTIVE,
  })
  status!: PlaceStatus;

  @Prop({ type: Number, default: null })
  averageRating!: number | null;

  @Prop({ type: Number, default: 0, min: 0 })
  reviewCount!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);

PlaceSchema.index({ category: 1, createdAt: 1, id: 1 });
