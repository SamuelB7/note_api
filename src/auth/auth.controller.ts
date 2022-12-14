import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, UserDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() dto: UserDto) { 
        return this.authService.register(dto)
    }
    
    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto)
    }
}