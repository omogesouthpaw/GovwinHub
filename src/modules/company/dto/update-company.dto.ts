import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  naicsCodes?: string[];

  @IsString()
  @IsOptional()
  cageCode?: string;

  @IsString()
  @IsOptional()
  uei?: string;
}
