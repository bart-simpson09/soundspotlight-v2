import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from "cookie-parser";
import {AuthGuard} from "./guards/auth.guard";
import {JwtService} from "./shared/jwt.service";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const jwtService = app.get(JwtService);
    const reflector = app.get(Reflector);

    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true
    });
    app.use(cookieParser());
    app.useGlobalGuards(new AuthGuard(jwtService, reflector));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();