import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartyService } from './party.service';
import { PartyGateway } from './party.gateway';
import { Party } from './party.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Party])],
    providers: [PartyService, PartyGateway],
    exports: [PartyService],
})
export class PartyModule { }
