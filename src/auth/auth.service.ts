import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, UserDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async register(dto: UserDto) {
        try {
            let hash = await argon.hash(dto.password)

            let user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    password: hash
                },
            })

            delete user.password

            return user;
        } catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code == 'P2002') {
                    throw new ForbiddenException('Email already in use')
                }
            }

            throw error
        }
    }

    async login(dto: AuthDto) {
        return {message: "Login route"}
    }
}