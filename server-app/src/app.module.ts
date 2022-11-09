import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StocksController } from './stocks/stocks.controller';
import { BrokersController } from './brokers/brokers.controller';
import { SettingsController } from './settings/settings.controller';
import { AppGateway } from './app/app.gateway';
import { BargainProcessController } from './bargain_process/bargain_process.controller';

@Module({
  imports: [],
  controllers: [AppController, StocksController, BrokersController, SettingsController, BargainProcessController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
