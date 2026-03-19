import {
  Body, ConflictException, Controller, Delete, ForbiddenException, Get,
  NotFoundException, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { IUser, UserRole } from '../interfaces';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() { email }: IUser) {
    return this.userService.findByEmail(email);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async listOrgUsers(@CurrentUser() user: IUser) {
    return await this.userService.findByCompany(user.companyId);
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.companyId !== currentUser.companyId)
      throw new ForbiddenException('Access denied');
    return user;
  }

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async createUser(@Body() dto: CreateUserDto, @CurrentUser() currentUser: IUser) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');
    return await this.userService.create({
      ...dto,
      firstName: dto.firstName || '',
      lastName: dto.lastName || '',
    });
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: IUser,
  ) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.companyId !== currentUser.companyId)
      throw new ForbiddenException('Access denied');
    return await this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER)
  async deleteUser(@Param('id') id: string, @CurrentUser() currentUser: IUser) {
    const user = await this.userService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.companyId !== currentUser.companyId)
      throw new ForbiddenException('Access denied');
    if (user.id === currentUser.userId)
      throw new ForbiddenException('Cannot delete yourself');
    await this.userService.softDelete(id);
    return { message: 'User deleted' };
  }
}
