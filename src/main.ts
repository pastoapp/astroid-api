import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.REDIS,
  //   options: {
  //     url: 'redis://localhost:6379',
  //   },
  // });

  await app.listen(3000);
}
bootstrap();
