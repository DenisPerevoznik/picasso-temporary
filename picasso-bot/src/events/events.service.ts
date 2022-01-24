import { Injectable } from '@nestjs/common';
import {Event} from "./entities/event.entity";
import {InjectModel} from "@nestjs/sequelize";
import sequelize from "sequelize";
import { Op } from 'sequelize';
import {GetEventsDto} from "./dto/get-events.dto";
import {Observable} from "rxjs";

@Injectable()
export class EventsService {

  constructor(
      @InjectModel(Event)
      private eventModel: typeof Event
  ) {
  }

  findAll() {
    return this.eventModel.findAll();
  }

  findAllByYearAndMonth(getEventsDto: GetEventsDto){
    return this.eventModel.findAll({where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), getEventsDto.month.toString()),
          sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), getEventsDto.year.toString())
        ]
      }});
  }

  findAllByDate(date: Date){
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return this.eventModel.findAll({where: {
        [Op.and]: [
          sequelize.where(sequelize.fn('DAY', sequelize.col('date')), day.toString()),
          sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month.toString()),
          sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year.toString())
        ]
      }});
  }

  findOne(id: number) {
    return this.eventModel.findByPk(id);
  }
}
