import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {

    login() {
        return "Login route"
    }

    register() {
        return "Register route"
    }
}