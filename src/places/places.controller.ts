  import { Body, Controller, Get, Post, Param, Patch, Delete, Query, Res } from '@nestjs/common';
  import type { Response } from 'express';
  import { PlacesService } from './places.service';
  import { Place } from './entities/place.entity';
  import { CreatePlaceDto } from './dto/create-place.dto';
  import { UpdatePlaceDto } from './dto/update-place.dto';
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
    async update(
      @Param('id') id: string,
      @Body() updatePlaceDto: UpdatePlaceDto,
    ): Promise<Place> {
      return await this.placesService.update(id, updatePlaceDto);
    }

    @Post()
    async create(
      @Body() createPlaceDto: CreatePlaceDto,
      @Res({ passthrough: true }) response: Response,
    ): Promise<Place> {
      const place = await this.placesService.create(createPlaceDto);

      response.setHeader('Location', `/api/v1/places/${place.id}`);

      return place;
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      await this.placesService.remove(id);
    }
  }