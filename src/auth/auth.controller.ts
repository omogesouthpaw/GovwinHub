import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { VerifyMfaDto } from '../user/dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login — returns full JWT pair or mfaPendingToken' })
  login(@Request() req: any) {
    return this.auth.login(req.user);
  }

  @Post('mfa/enroll')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate TOTP secret + QR code' })
  enrollMfa(@CurrentUser() user: any) {
    return this.auth.enrollMfa(user.id);
  }

  @Post('mfa/verify')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify TOTP token — issues full JWT pair' })
  verifyMfa(@CurrentUser() user: any, @Body() dto: VerifyMfaDto) {
    return this.auth.verifyMfa(user.id, dto.token);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Rotate refresh token and issue new pair' })
  refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.auth.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  logout(@CurrentUser() user: any) {
    return this.auth.logout(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: any) {
    return user;
  }
}
