import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletsModule } from './wallets/wallets.module';
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ClaimsModule } from './claims/claims.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';
import {ScheduleModule} from "@nestjs/schedule";
import {SharedModule} from "./shared/shared.module";

@Module({
  imports: [
      ServeStaticModule.forRoot({
          rootPath: join(__dirname, './', 'client'),
          exclude: ['/api*'],
      }),
      WalletsModule,
      ScheduleModule.forRoot(),
      SequelizeModule.forRoot(!!process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production'
          ? {
              dialect: 'mysql',
              host: 'localhost',
              port: 3306,
              username: 'bwaywmbc_picasso',
              password: 'pica$$oDB',
              database: 'bwaywmbc_picasso',
              autoLoadModels: true,
              synchronize: true,
          }
          : {
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'picasso-db',
            autoLoadModels: true,
            synchronize: true,
          }),
      UsersModule,
      EventsModule,
      ClaimsModule,
      SharedModule
  ],
  controllers: [AppController],
  providers: [
      AppService,
  ],
})
export class AppModule {}
