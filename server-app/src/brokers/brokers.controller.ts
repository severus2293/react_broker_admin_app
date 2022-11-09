import { Body, Controller, Get, Post } from '@nestjs/common';
import brokers from '../json_files/brokers.json';
import path from 'path';
import fs from 'fs';
@Controller('brokers')
export class BrokersController {
  @Get()
  getAll() {
    return brokers;
  }
  @Post('add_broker')
  addBroker(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    console.log('success broker add');
    brokers.push(body);
    fs.writeFileSync(__dirname + '/brokers.json', JSON.stringify(brokers));
  }
  @Post('remove_broker')
  removeBroker(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    console.log(body.id);
    for (let i = 0; i < brokers.length; i++) {
      if (brokers[i].id === parseInt(body.id)) {
        brokers.splice(i, 1);
        break;
      }
    }
    fs.writeFileSync(__dirname + '/brokers.json', JSON.stringify(brokers));
  }
  @Post('change_money')
  changeMoney(@Body() body) {
    console.log('change_money_success');
    const __dirname = path.resolve() + '/src/json_files';
    for (const value of brokers) {
      if (value.id === parseInt(body.id)) {
        value.money = body.money;
      }
    }
    console.log(brokers);
    fs.writeFileSync(__dirname + '/brokers.json', JSON.stringify(brokers));
  }
}
