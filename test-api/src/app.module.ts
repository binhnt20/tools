import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { EventsModule } from './events/events.module';
import { FileModule } from './file/file.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ApiModule,
    EventsModule,
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
