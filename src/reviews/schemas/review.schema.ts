import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  timestamps: true,
  id: false,
})
export class Review {
  @Prop({
    type: String,
    required: true,
    default: randomUUID,
    unique: true,
    immutable: true,
  })
  id!: string;

  @Prop({
    type: String,
    required: true,
    immutable: true,
    index: true,
  })
  placeId!: string;

  @Prop({ required: true, minlength: 2, maxlength: 100 })
  authorName!: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'La note doit être un nombre entier.',
    },
  })
  rating!: number;

  @Prop({ required: true, minlength: 5, maxlength: 500 })
  comment!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
