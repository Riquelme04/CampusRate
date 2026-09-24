import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min, MinLength,} from 'class-validator';
  
  export class CreateReviewDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    authorName!: string;
  
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(500)
    comment!: string;
  }