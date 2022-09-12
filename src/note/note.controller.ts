import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { NoteDto } from './dto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    all(@Req() req: Request) {
        return this.noteService.all(req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post() 
    create(@Body() dto: NoteDto, @Req() req: Request) {
        return this.noteService.create(dto, req.user)
    }
}
