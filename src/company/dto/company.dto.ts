import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import e from 'express';

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

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  name: string; 

  @ApiProperty({ example: ['541330', '541512'] })
  @IsArray()
  naicsCodes: string[];

  @ApiProperty({ example: 'CAGE12345', required: false })
  @IsString()
  @IsOptional()
  cageCode?: string;

  @ApiProperty({ example: 'UEI12345', required: false })
  @IsString()
  @IsOptional()
  uei?: string;
}
