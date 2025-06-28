import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TicketsModule } from './tickets/tickets.module';
import { TransportTypesModule } from './transport-types/transport-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // deixa disponível em todo projeto
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: config.get<number>('DB_PORT') || 3306,
        username: config.get<string>('DB_USERNAME') || 'user',
        password: config.get<string>('DB_PASSWORD') || 'password',
        database: config.get<string>('DB_NAME') || 'itinerarydb',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TicketsModule,
    TransportTypesModule,
  ],
})
export class AppModule {}
