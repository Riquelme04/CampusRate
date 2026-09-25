  import { Body, Controller, Get, Post, Param, Patch, Delete, Query, Res, HttpCode } from '@nestjs/common';
  import type { Response } from 'express';
  import { PlacesService } from './places.service';
  import { Place } from './entities/place.entity';
  import { CreatePlaceDto } from './dto/create-place.dto';
  import { UpdatePlaceDto } from './dto/update-place.dto';
  import { ListPlacesQueryDto } from './dto/list-places-query.dto';
  import { ApiOperation, ApiTags } from '@nestjs/swagger';
  import { ApiParam, ApiQuery, ApiResponse, ApiExtraModels, getSchemaPath} from '@nestjs/swagger';
  import { PlaceCategory } from './entities/place.entity';
  import { ProblemDetailsDto } from '../common/filter/problem-details.dto';


  @ApiTags('Places')
@ApiExtraModels(Place,ProblemDetailsDto)
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  // CONSULTER UN ENDROIT
  @Get(':id')
  @ApiOperation({
    summary: 'Consulter un endroit par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'endroit",
  })
  @ApiResponse({
    status: 200,
    description: 'Endroit trouvé',
    type: Place,
  })
  @ApiResponse({
    status: 404,
    description: 'Endroit introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  findOne(@Param('id') id: string): Place {
    return this.placesService.findOne(id);
  }

  // LISTER LES ENDROITS
  @Get()
  @ApiOperation({
    summary: 'Lister les endroits avec filtrage et pagination',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: PlaceCategory,
    description: 'Filtrer les endroits par catégorie',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    minimum: 1,
    description: 'Numéro de la page',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    minimum: 1,
    maximum: 50,
    description: "Nombre d'endroits par page",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des endroits',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(Place),
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalItems: { type: 'integer', example: 1 },
            totalPages: { type: 'integer', example: 1 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Paramètres de filtrage ou de pagination invalides',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  findAll(@Query() query: ListPlacesQueryDto) {
    return this.placesService.findAllPaginated(query);
  }

  // MODIFIER UN ENDROIT
  @Patch(':id')
  @ApiOperation({
    summary: 'Modifier partiellement un endroit',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'endroit à modifier",
  })
  @ApiResponse({
    status: 200,
    description: 'Endroit modifié',
    type: Place,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Endroit introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place> {
    return await this.placesService.update(id, updatePlaceDto);
  }

  // CRÉER UN ENDROIT
  @Post()
  @ApiOperation({
    summary: 'Créer un nouvel endroit',
  })
  @ApiResponse({
    status: 201,
    description: 'Endroit créé avec un en-tête Location',
    type: Place,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async create(
    @Body() createPlaceDto: CreatePlaceDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Place> {
    const place = await this.placesService.create(createPlaceDto);

    response.setHeader('Location', `/api/v1/places/${place.id}`);

    return place;
  }

  // SUPPRIMER UN ENDROIT
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Supprimer un endroit par son identifiant',
  })
  @ApiParam({
    name: 'id',
    description: "Identifiant de l'endroit à supprimer",
  })
  @ApiResponse({
    status: 204,
    description: 'Endroit supprimé sans contenu',
  })
  @ApiResponse({
    status: 404,
    description: 'Endroit introuvable',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'Impossible de supprimer un endroit qui possède des appréciations',
    content: {
      'application/problem+json': {
        schema: {
          $ref: getSchemaPath(ProblemDetailsDto),
        },
      },
    },
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.placesService.remove(id);
  }
}