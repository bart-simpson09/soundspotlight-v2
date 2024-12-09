import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import * as crypto from "node:crypto";
import {SignJWT, jwtVerify} from "jose";

interface TokenPayload {
    email: string;
    role: string;
    sub: string;
}

@Injectable()
export class JwtService {
    constructor(
        private configService: ConfigService,
    ) {
        this.jwtKey = crypto.createSecretKey(this.configService.get<string>('JWT_SECRET'), 'utf-8');
    }

    private readonly jwtKey: crypto.KeyObject;

    sign(payload: TokenPayload) {
        const jwt = new SignJWT({...payload});
        jwt.setProtectedHeader({
            typ: 'JWT',
            alg: 'HS256',
        });
        jwt.setSubject(payload.sub);
        jwt.setExpirationTime('15m');

        return jwt.sign(this.jwtKey);
    }

    async verify(token: string): Promise<TokenPayload> {
        const {payload} = await jwtVerify<TokenPayload>(token, this.jwtKey);

        return payload;
    }
}