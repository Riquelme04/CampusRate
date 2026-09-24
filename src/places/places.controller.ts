import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Query } from '@nestjs/common';
import { Res } from '@nestjs/common';
import type { Response } from 'express';
import { ListPlacesQueryDto } from './dto/list-places-query.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Place {
    return this.placesService.findOne(id);
  }
  @Get()
  findAll(@Query() query: ListPlacesQueryDto) {
    return this.placesService.findAllPaginated(query);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Place {
    return this.placesService.update(id, updatePlaceDto);
  }

  @Post()
  create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Res({ passthrough: true }) response: Response,
  ): Place {
    const place = this.placesService.create(createPlaceDto);

    response.setHeader('Location', `/api/v1/places/${place.id}`);

    return place;
  }
  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.placesService.remove(id);
  }
}
