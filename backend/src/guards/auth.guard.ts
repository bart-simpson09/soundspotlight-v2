import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {JwtService} from "../shared/jwt.service";
import {Reflector} from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.jwt;

        const authMetaData = this.reflector.getAllAndOverride<string[]>(
            'authorized',
            [context.getHandler(), context.getClass()],
        );

        if (authMetaData?.includes('SkipAuthorizationCheck')) {
            return true;
        }

        if (!token) {
            return false;
        }

        try {
            this.jwtService.verify(token);
            return true;

        } catch (err) {
            return false;
        }
    }
}