import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PartyService } from './party.service';

@WebSocketGateway({ cors: true })
export class PartyGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly partyService: PartyService) { }

    @SubscribeMessage('joinParty')
    handleJoinParty(@MessageBody() data: { roomCode: string; userId: string }) {
        // Logic to join party
        console.log('User joined party:', data);
    }
}
