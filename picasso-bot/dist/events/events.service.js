"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const event_entity_1 = require("./entities/event.entity");
const sequelize_1 = require("@nestjs/sequelize");
const sequelize_2 = require("sequelize");
const sequelize_3 = require("sequelize");
let EventsService = class EventsService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    findAll() {
        return this.eventModel.findAll();
    }
    findAllByYearAndMonth(getEventsDto) {
        return this.eventModel.findAll({ where: {
                [sequelize_3.Op.and]: [
                    sequelize_2.default.where(sequelize_2.default.fn('MONTH', sequelize_2.default.col('date')), getEventsDto.month.toString()),
                    sequelize_2.default.where(sequelize_2.default.fn('YEAR', sequelize_2.default.col('date')), getEventsDto.year.toString())
                ]
            } });
    }
    findAllByDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return this.eventModel.findAll({ where: {
                [sequelize_3.Op.and]: [
                    sequelize_2.default.where(sequelize_2.default.fn('DAY', sequelize_2.default.col('date')), day.toString()),
                    sequelize_2.default.where(sequelize_2.default.fn('MONTH', sequelize_2.default.col('date')), month.toString()),
                    sequelize_2.default.where(sequelize_2.default.fn('YEAR', sequelize_2.default.col('date')), year.toString())
                ]
            } });
    }
    findOne(id) {
        return this.eventModel.findByPk(id);
    }
};
EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(event_entity_1.Event)),
    __metadata("design:paramtypes", [Object])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map