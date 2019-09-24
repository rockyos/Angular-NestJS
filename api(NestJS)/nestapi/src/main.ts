import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
var session = require('express-session');

const config = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: config.SessionSecret,
    resave: config.SessionReSave,
    saveUninitialized: config.SessionSaveUnitialized
  }))
  await app.listen(3000);
}
bootstrap();
