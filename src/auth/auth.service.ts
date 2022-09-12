import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto, UserDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

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

            return this.loginToken(user.id, user.email)
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
        let user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if(!user) {
            throw new ForbiddenException('Email or password incorrect')
        }

        let passwordMatch = await argon.verify(user.password, dto.password)

        if(passwordMatch == false) {
            throw new ForbiddenException('Email or password incorrect')
        }

        return this.loginToken(user.id, user.email)
    }

    async loginToken(userId: number, email: string) {
        
        let data = {
            sub: userId, 
            email
        }

        let token = await this.jwt.signAsync(data, {
            expiresIn: '30m',
            secret: process.env.JWT_SECRET
        })

        return {
            access_token: token
        }
    }
}