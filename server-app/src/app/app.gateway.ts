import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import stocks from '../json_files/stocks.json';
import path from 'path';
import fs from 'fs';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'realtime_barg',
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }
  @SubscribeMessage('buy:get')
  async handleMessagesGet() {
    this.server.emit('counts', stocks);
  }
  @SubscribeMessage('buy:post')
  async handleMessageBuyPost(@MessageBody() body) {
    const __dirname = path.resolve() + '/src/json_files';
    for(let value of stocks){
      if(value.id === body.id){
        value.count -= body.count;
      }
    }
    fs.writeFileSync(
      __dirname + '/stocks.json',
      JSON.stringify(stocks),
    );
    await this.handleMessagesGet();
  }
  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    client.broadcast.emit('log', `${client.id} disconnected`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    client.broadcast.emit('log', process);
  }
}
