import {NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from "cookie-parser";
import {AuthGuard} from "./guards/auth.guard";
import {JwtService} from "./shared/jwt.service";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

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

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle('SoundSpotlight API')
        .setDescription('The SoundSpotlight API provides a comprehensive set of endpoints for managing and interacting with music-related content. It allows users to explore songs, manage playlists, and interact with social features such as likes and comments. This API is designed to support developers in building dynamic music applications or integrations by providing robust and flexible features.')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();