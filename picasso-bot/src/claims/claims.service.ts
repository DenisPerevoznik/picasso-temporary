import { Injectable } from '@nestjs/common';

@Injectable()
export class ClaimsService {

  findAll() {
    return `This action returns all claims`;
  }

  findOne(id: number) {
    return `This action returns a #${id} claim`;
  }
}
