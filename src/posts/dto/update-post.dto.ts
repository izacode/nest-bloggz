import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  id: string;
  @IsNotEmpty()
  @MaxLength(30)
  title: string;
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string;
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
  @IsNotEmpty()
  @IsString()
  bloggerId: string;
}
