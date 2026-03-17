import {
  Body, Controller, ForbiddenException, Get, NotFoundException,
  Param, Patch, UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUser, UserRole } from '../interfaces';
import { UpdateCompanyDto } from './dto';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('my')
  async getMyCompany(@CurrentUser() user: IUser) {
    const org = await this.companyService.findById(user.companyId);
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  @Patch('my')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async updateMyCompany(@Body() dto: UpdateCompanyDto, @CurrentUser() user: IUser) {
    const org = await this.companyService.findById(user.companyId);
    if (!org) throw new NotFoundException('Organization not found');
    return this.companyService.updateOrganization(user.companyId, dto);
  }

  @Get(':id')
  async getCompany(@Param('id') id: string, @CurrentUser() user: IUser) {
    const org = await this.companyService.findById(id);
    if (!org) throw new NotFoundException('Organization not found');
    if (org.id !== user.companyId)
      throw new ForbiddenException('Access denied');
    return org;
  }
}
