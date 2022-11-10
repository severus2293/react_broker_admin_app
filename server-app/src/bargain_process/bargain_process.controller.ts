import {Body, Controller, Get, Post} from '@nestjs/common';
import process from '../json_files/bargaing_process.json';
import path from 'path';
import fs from 'fs';

@Controller('bargain-process')
export class BargainProcessController {
  private timer;
  @Get('time')
  getTime() {
    return process.time;
  }
  @Get('date')
  getDate() {
    return process.date;
    }
    @Post('change_time')
    change_time(@Body() body) {
        const __dirname = path.resolve() + '/src/json_files';
        process.time = body.time
        fs.writeFileSync(__dirname + '/bargaing_process.json', JSON.stringify(process));
    }
  @Post('change_start')
  change_start(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    process.start = body.start
    fs.writeFileSync(__dirname + '/bargaing_process.json', JSON.stringify(process));
  }
  @Post('start_bargaing')
  start_bargaing(@Body() body) {

    process.time = body.time
    const tmp = body.date.split('-');
    process.date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
    var started = process.time;
    if (process.start === false) {
      process.start = true
      this.timer = setInterval(() => {
        if (process.time > 0) {
          process.time -= 1;
          console.log(process.time);
        } else {
          let day = new Date(process.date);

          const offset = day.getTimezoneOffset();
          day = new Date(day.getTime() - offset * 60 * 1000);
          day.setDate(day.getDate() + 1);
          const tmp = day.toISOString().split('T')[0].split('-');
          process.date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
          process.time = started;
        }
      }, 1000);
    } else {
      clearInterval(this.timer),
          this.timer = setInterval(() => {
            if (process.time > 0) {
              process.time -= 1;
              console.log(process.time);
            } else {
              let day = new Date(process.date);

              const offset = day.getTimezoneOffset();
              day = new Date(day.getTime() - offset * 60 * 1000);
              day.setDate(day.getDate() + 1);
              const tmp = day.toISOString().split('T')[0].split('-');
              process.date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
              process.time = started;
            }
          }, 1000);
      /*
      if (process.start) {
        console.log('true')
        const timer = setInterval(() => {
          if (process.time > 0) {
                    process.time -= 1;
            console.log(process.time);
                }
                else{
            let day = new Date(process.date);

            const offset = day.getTimezoneOffset();
            day = new Date(day.getTime() - offset * 60 * 1000);
            day.setDate(day.getDate() + 1);
            const tmp = day.toISOString().split('T')[0].split('-');
            process.date = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
            process.time = started;
          }
        }, 1000);
      }*/
    }
  }
  @Post('change_date')
  change_date(@Body() body) {
        const __dirname = path.resolve() + '/src/json_files';
        process.date = body.date
    fs.writeFileSync(
      __dirname + '/bargaing_process.json',
      JSON.stringify(process));
  }
}
