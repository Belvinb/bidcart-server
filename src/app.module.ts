import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';


import config from './config/keys';
import { ItemsModule } from './compoent/items/items.module';
import { UserModule } from './compoent/user/user.module';
import { AuthModule } from './compoent/auth/auth.module';

@Module({
  imports: [ItemsModule, MongooseModule.forRoot(config.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
