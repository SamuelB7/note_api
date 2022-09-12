import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NoteDto } from './dto';

@Injectable()
export class NoteService {
    constructor (private prisma: PrismaService) {}

    async all(user) {
        let userNotes = await this.prisma.note.findMany({
            where: {
                user_id: user.id
            }
        })

        return userNotes
    }

    async create(dto: NoteDto, user) {
        try {
            let note = await this.prisma.note.create({
                data: {
                    title: dto.title,
                    content: dto.content,
                    user_id: user.id
                }
            })

            return note
        } catch (error) {
            return error
        }
    }
}
