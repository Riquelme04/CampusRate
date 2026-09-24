export enum PlaceCategory {
  STUDY_SPACE = 'STUDY_SPACE',
  LIBRARY = 'LIBRARY',
  FOOD_SERVICE = 'FOOD_SERVICE',
  SPORTS = 'SPORTS',
  STUDENT_SERVICE = 'STUDENT_SERVICE',
  COMPUTER_LAB = 'COMPUTER_LAB',
  OTHER = 'OTHER',
}

export enum PlaceStatus {
  ACTIVE = 'ACTIVE',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
  INACTIVE = 'INACTIVE',
}

export class Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  address: string;
  services: string[];
  status: PlaceStatus;
  averageRating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
