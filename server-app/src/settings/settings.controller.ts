import { Body, Controller, Get, Post } from '@nestjs/common';
import settings from '../json_files/settings.json';
import process from '../json_files/bargaing_process.json';
import path from 'path';
import fs from 'fs';
@Controller('settings')
export class SettingsController {
  @Get()
  getAll() {
    return settings;
  }
  @Post('change_start')
  changeStart(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    settings.start = body.start;
    process.date =
      '' +
      body.start.split('-')[1] +
      '/' +
      body.start.split('-')[2] +
      '/' +
      body.start.split('-')[0];
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings));
  }
  @Post('change_end')
  changeEnd(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    settings.end = body.end;
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings));
  }
  @Post('change_speed')
  changeSpeed(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    settings.speed = body.speed;
    process.time = body.speed;
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings));
  }
}
