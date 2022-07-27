import { IsOptional } from 'class-validator';

export class GetBloggersFilterDto {
  @IsOptional()
  SearchNameTerm?: string = null;
  @IsOptional()
  PageNumber?: string | number = 1;
  @IsOptional()
  PageSize?: string | number = 10;
}
