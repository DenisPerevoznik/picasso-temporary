import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {Event} from "./entities/event.entity";
import {InjectModel} from "@nestjs/sequelize";
import sequelize from "sequelize";
import { Op } from 'sequelize';
import {GetEventsDto} from "./dto/get-events.dto";

@Injectable()
export class EventsService {

  constructor(
      @InjectModel(Event)
      private eventModel: typeof Event
  ) {
  }

  create(createEventDto: CreateEventDto) {
    return this.eventModel.create(createEventDto);
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

  update(id: number, updateEventDto: UpdateEventDto) {
    return this.eventModel.update(updateEventDto, {where: {id}});
  }

  remove(id: number) {
    return this.eventModel.destroy({where: {id}})
  }
}
