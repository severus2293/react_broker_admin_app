import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import {Body, Logger, Post} from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import brokers from '../json_files/brokers.json';
import path from "path";
import fs from "fs";
import stocks_info from '../json_files/stocks_info.json';
import stocks from '../json_files/stocks.json';
import settings from "../json_files/settings.json";
import process from "../json_files/bargaing_process.json";
import {clearInterval} from "timers";
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'usersocket',
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private process = false;
  private timer = null;
  private time = 0;
  private cur_day = '';
  private end = '';
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', settings);
  }

  @SubscribeMessage('changeactiveUser')
  ActivateUser(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    const __dirname = path.resolve() + '/src/json_files';
    for (let i = 0; i < brokers.length; i++) {
      if (brokers[i].id === parseInt(body.id)) {
        // @ts-ignore
        brokers[i].active = !brokers[i].active

        break;
      }
    }
    fs.writeFileSync(__dirname + '/brokers.json', JSON.stringify(brokers));
    this.server.emit('authorization_status', brokers);
  }
  @SubscribeMessage('delUser')
  DelUser(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    for (let i = 0; i < brokers.length; i++) {
      if (brokers[i].id === parseInt(body.id)) {
        brokers.splice(i, 1);
        break;
      }
    }
    this.server.emit('authorization_status', brokers);
  }
  @SubscribeMessage('addUser')
  AddUser(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    const __dirname = path.resolve() + '/src/json_files';
    brokers.push(body)
    fs.writeFileSync(__dirname + '/brokers.json', JSON.stringify(brokers));
    this.server.emit('authorization_status', brokers);
  }
  @SubscribeMessage('changeCountStocks')
  ChangeCountStocks(client: Socket, body): void {
    const __dirname = path.resolve() + '/src/json_files';
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].id === parseInt(body.id)) {
        stocks[i].count = body.count
        break;
      }
    }
    const res = [];
    for (let i = 0; i < stocks.length; i++) {
        res.push({ data: stocks[i], info: stocks_info[i] });
    }
    fs.writeFileSync(__dirname + '/stocks.json', JSON.stringify(stocks));
    this.server.emit('BargainStocks', res);
  }
  @SubscribeMessage('changeParticipationStocks')
  ChangeParticipationStocks(client: Socket, body): void {
    const __dirname = path.resolve() + '/src/json_files';
    for (let i = 0; i < stocks.length; i++) {
      if (stocks[i].id === parseInt(body.id)) {
        stocks[i].participation = !stocks[i].participation
        break;
      }
    }
    fs.writeFileSync(__dirname + '/stocks.json', JSON.stringify(stocks));
    const res = [];
    for (let i = 0; i < stocks.length; i++) {
        res.push({ data: stocks[i], info: stocks_info[i] });
    }
    this.server.emit('BargainStocks', res);
  }
  @SubscribeMessage('changeStart')
  changeStart(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    settings.start = body.start;
    this.server.emit('SettingsUpdate', settings);
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings));
  }
  @SubscribeMessage('changeEnd')
  changeEnd(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    settings.end = body.end;
    this.server.emit('SettingsUpdate', settings);
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings));
  }
  @SubscribeMessage('changeSpeed')
  changeSpeed(@Body() body) {
    const __dirname = path.resolve() + '/src/json_files';
    settings.speed = body.speed;
    this.server.emit('SettingsUpdate', settings);
    fs.writeFileSync(__dirname + '/settings.json', JSON.stringify(settings));
  }
  @SubscribeMessage('changeMoney')
  ChangeMoney(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    const __dirname = path.resolve() + '/src/json_files';
    for (let i = 0; i < brokers.length; i++) {
      if (brokers[i].id === parseInt(body.id)) {
        brokers[i].money = body.money
        break;
      }
    }
    fs.writeFileSync(__dirname + '/brokers.json', JSON.stringify(brokers));
    this.server.emit('authorization_status', brokers);
  }
  /*@SubscribeMessage('start_bargaing')
  StartBargaing(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    var timer
    if(body.process === true){
      var time = settings.speed
      var cur_day = ''+ settings.start.split('-')[1] +'/'+ settings.start.split('-')[2] + '/'+ settings.start.split('-')[0]
      var end = ''+ settings.end.split('-')[1] +'/'+ settings.end.split('-')[2] + '/'+ settings.end.split('-')[0]
      clearInterval(timer)
      timer = setInterval(() => {
        if(cur_day === end){
          clearInterval(timer)
        }
        if (time > 0) {
          time -= 1;
          console.log(time);
          const message = {
            speed: time,
            date: cur_day
          }
          this.server.emit('ChangeTime',message)
        } else {
          time = settings.speed
          let day = new Date(cur_day);
          const offset = day.getTimezoneOffset();
          day = new Date(day.getTime() - offset * 60 * 1000);
          day.setDate(day.getDate() + 1);
          const tmp = day.toISOString().split('T')[0].split('-');
          cur_day = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
          const message = {
            speed: time,
            date: cur_day
          }
          this.server.emit('ChangeTime',message)
        }
      }, 1000);
    }
  }*/
  @SubscribeMessage('start_bargaing')
  StartBargaing(client: Socket, body): void {   // передать что клиент зашёл в аккаунт
    if(body.process === true){
      if(this.timer){
        clearInterval(this.timer)
        const message = {
          speed: settings.speed,
          date: ''+ settings.start.split('-')[1] +'/'+ settings.start.split('-')[2] + '/'+ settings.start.split('-')[0]
        }
        this.server.emit('ChangeTime',message)
      }
      var time = settings.speed
      var cur_day = ''+ settings.start.split('-')[1] +'/'+ settings.start.split('-')[2] + '/'+ settings.start.split('-')[0]
      var end = ''+ settings.end.split('-')[1] +'/'+ settings.end.split('-')[2] + '/'+ settings.end.split('-')[0]
      this.timer = setInterval(() => {
        if(cur_day === end){
          clearInterval(this.timer)
          this.timer = null
        }
        if (time > 0) {
          time -= 1;
          console.log(time);
          const message = {
            speed: time,
            date: cur_day
          }
          this.server.emit('ChangeTime',message)
        } else {
          time = settings.speed
          let day = new Date(cur_day);
          const offset = day.getTimezoneOffset();
          day = new Date(day.getTime() - offset * 60 * 1000);
          day.setDate(day.getDate() + 1);
          const tmp = day.toISOString().split('T')[0].split('-');
          cur_day = '' + tmp[1] + '/' + tmp[2] + '/' + tmp[0];
          const message = {
            speed: time,
            date: cur_day
          }
          this.server.emit('ChangeTime',message)
        }
      }, 1000);
    }
  }
  afterInit(server: Server) {
    //this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    // this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    //this.logger.log(`Client connected: ${client.id}`);
    // console.log('connect...' + client.id);
    console.log('connected:....')
    this.server.emit('authorization_status', brokers); // при заходе на авторизацию показать какой профиль свободен
  }
}
