import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [], //could fill iwth AppController
  providers: [], //could fill with AppServie
})
export class AppModule {}

