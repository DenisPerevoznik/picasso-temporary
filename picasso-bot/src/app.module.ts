import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {SequelizeModule} from "@nestjs/sequelize";
import { EventsModule } from './events/events.module';
import { ClaimsModule } from './claims/claims.module';
import {ScheduleModule} from "@nestjs/schedule";
import {TasksService} from "./tasks.service";
import {SharedModule} from "./shared/shared.module";

@Module({
  imports: [
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
      EventsModule,
      ClaimsModule,
      SharedModule
  ],
  controllers: [AppController],
  providers: [
      AppService,
      TasksService,
  ],
})
export class AppModule {}
