import {
  Body, Controller, ForbiddenException, Get, NotFoundException,
  Param, Patch, Post, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL, CacheKey } from '@nestjs/cache-manager';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUser, UserRole } from '../interfaces';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('my')
@UseGuards(JwtAuthGuard, RolesGuard)
  async getMyCompany(@CurrentUser() user: IUser) {
    const org = await this.companyService.findById(user.companyId);
    if (!org) throw new NotFoundException('Company not found');
    return org;
  }

  @Post()
  // @Roles(UserRole.OWNER)
  async createCompany(@Body() dto: CreateCompanyDto, @CurrentUser() user: IUser) {
    return this.companyService.createCompany(dto);
  }

  @Patch('my')
@UseGuards(JwtAuthGuard, RolesGuard)

  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async updateMyCompany(@Body() dto: UpdateCompanyDto, @CurrentUser() user: IUser) {
    const org = await this.companyService.findById(user.companyId);
    if (!org) throw new NotFoundException('Company not found');
    return this.companyService.updateCompany(user.companyId, dto);
  }

  @Get(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('company')
  @CacheTTL(30_000)
  async getCompany(@Param('id') id: string, @CurrentUser() user: IUser) {
    const org = await this.companyService.findById(id);
    if (!org) throw new NotFoundException('Company not found');
    if (org.id !== user.companyId)
      throw new ForbiddenException('Access denied');
    return org;
  }
}
