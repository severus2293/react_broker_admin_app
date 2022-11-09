import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import stocks_info from '../json_files/stocks_info.json';
import stocks from '../json_files/stocks.json';
import { Istock } from '../Models';
import path from 'path';
import fs from 'fs';
@Controller('stocks')
export class StocksController {
  @Get()
  getAll() {
    const body: Istock[] = [];
    for (let i = 0; i < stocks.length; i++) {
      body.push({ data: stocks[i], info: stocks_info[i] });
    }
    return body;
  }
  @Get('stocks_bargaining')
  getParticipationStocks() {
    const res = [];
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].participation) {
        res.push({ data: stocks[i], info: stocks_info[i] });
      }
    }
    return res;
  }
  @Post('change_particion')
  changeParticion(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    for (const value of stocks) {
      if (value.id === parseInt(body.id)) {
        value.participation = !value.participation;
      }
    }
    fs.writeFileSync(__dirname + '/stocks.json', JSON.stringify(stocks));
  }
  @Post('change_count_bargaining')
  changeCountBargaining(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    for (const value of stocks) {
      if (value.id === parseInt(body.id)) {
        value.count = body.count;
      }
    }
    fs.writeFileSync(__dirname + '/stocks.json', JSON.stringify(stocks));
  }
  @Post('buy_stock')
  buyStock(@Body() body) {
    for (const value of stocks) {
      if (value.id === parseInt(body.id)) {
        value.count -= body.count;
      }
    }
  }
}
