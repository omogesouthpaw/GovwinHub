import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  lastName: string;

  @IsString()
  companyName: string;

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
