import { Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Place {
  return this.placesService.findOne(id);
  }
  @Get()
  findAll(): Place[] {
    return this.placesService.findAll();
  }
  @Patch(':id')
  update(
  @Param('id') id: string,
  @Body() updatePlaceDto: UpdatePlaceDto,): Place {
   return this.placesService.update(id, updatePlaceDto);
  }

  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto): Place {
    return this.placesService.create(createPlaceDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string): void {
  this.placesService.remove(id);
}

}