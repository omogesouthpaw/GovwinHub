import { Module, forwardRef } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../user/user.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [CompanyController],
  providers: [CompanyService, UsersService, JwtAuthGuard],
  exports: [CompanyService],
})
export class CompanyModule {}
