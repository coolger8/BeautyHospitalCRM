import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function runSeeder() {
  console.log('Starting seeder...');
  
  const app = await NestFactory.createApplicationContext(SeederModule);
  const seederService = app.get(SeederService);
  
  try {
    const result = await seederService.seed();
    console.log('Seeding completed successfully:', result);
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

runSeeder();