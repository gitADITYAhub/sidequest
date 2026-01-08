import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { ExploredTile } from './explored-tile.entity';
import { Location } from './location.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExploredTile, Location]),
        UserModule,
    ],
    controllers: [MapController],
    providers: [MapService],
    exports: [MapService],
})
export class MapModule { }
