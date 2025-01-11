import {
    Body,
    Controller,
    Get,
    HttpException,
    Patch,
    Post,
    Req,
    Res,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Request, Response} from "express";
import {RegisterDto, RegisterDtoClass, registerDtoSchema} from "./dtos/registerDtoSchema";
import {LoginDto, LoginDtoClass, loginDtoSchema} from "./dtos/loginDtoSchema";
import {AuthMetaData} from "../guards/auth.metadata.decorator";
import {Roles} from "../guards/roles.decorator";
import {Role} from "../entities/user.entity";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiResponse} from "@nestjs/swagger";

@Controller()
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    @Post('/auth/login')
    @AuthMetaData('SkipAuthorizationCheck')
    @ApiOperation({ summary: 'Log in a user' })
    @ApiBody({ type: LoginDtoClass })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Res() response: Response, @Body() bodyRaw: object) {
        const parseSuccess = loginDtoSchema.safeParse(bodyRaw);
        if (!parseSuccess.success) {
            throw new HttpException('Invalid request body', 400);
        }

        const loginDto: LoginDto = parseSuccess.data;

        const user = await this.usersService.verify(loginDto);
        if (!user) {
            throw new HttpException('Invalid credentials', 401);
        }

        delete user.avatar;

        await this.usersService.createJWT(user, response);
    }

    @Post('/auth/register')
    @AuthMetaData('SkipAuthorizationCheck')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDtoClass })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    @ApiResponse({
        status: 409,
        description: 'User with this email already exists',
    })
    async register(@Res() response: Response, @Body() bodyRaw: object) {
        const parseResult = registerDtoSchema.safeParse(bodyRaw);
        if (!parseResult.success) {
            const validationErrors = parseResult.error.errors.map(err => ({
                field: err.path[0],
                message: err.message,
            }));
            throw new HttpException(
                {message: 'Validation failed', errors: validationErrors},
                400
            );
        }

        const dto: RegisterDto = parseResult.data;

        const user = await this.usersService.register(dto);
        delete user.avatar;

        await this.usersService.createJWT(user, response);
    }

    @Post('/auth/logout')
    @AuthMetaData('SkipAuthorizationCheck')
    @ApiOperation({ summary: 'Log out a user' })
    @ApiResponse({ status: 200, description: 'Logged out successfully' })
    async logout(@Res() response: Response) {
        response.clearCookie('jwt', {
            httpOnly: true,
        });
        response.status(200).json({message: 'Logged out successfully'});
        response.end();
    }

    @Get('/users/:id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: String, description: 'User ID' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async user(@Req() req: Request, @Res() res: Response) {
        const userId = req.params.id;

        try {
            const user = await this.usersService.getUserById(userId);

            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            delete user.password;

            user.avatar = await this.usersService.fetchAndEncodeAvatar(userId);

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Get('/users')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Get all users (admin only)' })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'Users retrieved successfully',
    })
    @ApiResponse({ status: 404, description: 'Users not found' })
    async users(@Res() res: Response) {
        try {
            const users = await this.usersService.getAllUsers();

            if (!users || users.length === 0) {
                return res.status(404).json({message: "Users not found"});
            }

            await Promise.all(users.map(async (user) => {
                user.avatar = await this.usersService.fetchAndEncodeAvatar(user.id);
            }));

            return res.status(200).json(users);
        } catch (err) {
            return res.status(500).json({message: 'Internal server error'});
        }
    }

    @Post('/users/changePhoto')
    @UseInterceptors(FileInterceptor('userPhoto'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Change the currently authenticated user\'s photo' })
    @ApiHeader({
        name: 'current_user_id',
        description: 'ID of the currently authenticated user',
        required: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Photo updated successfully',
    })
    async changePhoto(
        @UploadedFile() userPhoto: Express.Multer.File,
        @Req() req: Request
    ) {
        const currentUserId = req.headers['current_user_id'].toString();
        return this.usersService.changeUserPhoto(userPhoto, currentUserId);
    }

    @Patch('/users/modifyRole')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Modify a user\'s role (admin only)' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            example: {
                userID: 'string',
                action: 'grant (to promote to admin) or revoke (to downgrade to user)',
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Role updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid action' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async modifyUserRole(
        @Body() body: { userID: string; action: string },
    ) {
        const {userID, action} = body;
        return this.usersService.modifyUserRole(userID, action);
    }
}