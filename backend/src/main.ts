import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // Create HTTP app
  const httpApp = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  httpApp.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await httpApp.listen(process.env.PORT ?? 3001);

  // 暂时注释掉gRPC微服务，避免启动错误
  // Create gRPC microservice
  // const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'customer',
  //     protoPath: join(__dirname, 'proto/customer.proto'),
  //     url: 'localhost:50051',
  //   },
  // });

  // await grpcApp.listen();
}
bootstrap();