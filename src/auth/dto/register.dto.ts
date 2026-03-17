import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Acme Inc.' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: ['12345', '67890'] })
  @IsArray()
  @IsOptional()
  naicsCodes?: string[];

  @ApiProperty({ example: 'ABC123' })
  @IsString()
  @IsOptional()
  cageCode?: string;

  @ApiProperty({ example: 'UEI123456789' })
  @IsString()
  @IsOptional()
  uei?: string;
}
