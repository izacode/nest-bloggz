import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  id: string;
  @IsNotEmpty()
  @IsString()
  @Length(20, 300)
  content: string;
  @IsOptional()
  postId: string;
}
