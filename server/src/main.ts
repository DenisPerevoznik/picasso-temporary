import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    const whitelist = ['http://localhost:4200', 'https://picasso-holders.com.ua'];
  app.enableCors({origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }});
  await app.listen(3000);
}
bootstrap();
