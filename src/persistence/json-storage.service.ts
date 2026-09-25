import { Injectable, OnModuleInit } from '@nestjs/common';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { config } from '../config/config';
import { Place } from '../places/entities/place.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class JsonStorageService implements OnModuleInit {
  readonly places: Place[] = [];
  readonly reviews: Review[] = [];

  // Au démarrage de NestJS
  async onModuleInit() {
    const donnees = await this.lire();

    this.places.push(...donnees.places);
    this.reviews.push(...donnees.reviews);
  }

  // LIRE le fichier JSON
  async lire() {
    let json: string;

    try {
      json = await readFile(config.dataFilePath, 'utf8');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const donnees = { places: [], reviews: [] };

        await this.sauvegarder(donnees);

        return donnees;
      }

      throw new Error('Impossible de lire le fichier JSON');
    }

    try {
      const donnees = JSON.parse(json) as {
        places: Place[];
        reviews: Review[];
      };

      if (
        !Array.isArray(donnees?.places) ||
        !Array.isArray(donnees?.reviews)
      ) {
        throw new Error('Format invalide');
      }

      return donnees;
    } catch {
      throw new Error('Le fichier JSON est invalide');
    }
  }

  // ÉCRIRE / SAUVEGARDER le fichier JSON
  async sauvegarder(donnees: unknown) {
    await mkdir(dirname(config.dataFilePath), {
      recursive: true,
    });

    const json = JSON.stringify(donnees, null, 2);

    await writeFile(config.dataFilePath, json, 'utf8');
  }
}