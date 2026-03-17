"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const roles_guard_1 = require("./common/guards/roles.guard");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableVersioning({ type: common_1.VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector), new roles_guard_1.RolesGuard(reflector));
    if (process.env.NODE_ENV !== 'production') {
        const doc = new swagger_1.DocumentBuilder()
            .setTitle('GovCon Platform API')
            .setDescription('Core Backend')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        swagger_1.SwaggerModule.setup('api/docs', app, swagger_1.SwaggerModule.createDocument(app, doc));
    }
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map