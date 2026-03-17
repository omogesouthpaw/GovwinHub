import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/user/user.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly jwtService;
    private readonly configService;
    private readonly userService;
    constructor(jwtService: JwtService, configService: ConfigService, userService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
}
