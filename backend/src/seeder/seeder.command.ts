import { Command, CommandRunner } from 'nest-commander';
import { SeederService } from './seeder.service';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
})
export class SeederCommand extends CommandRunner {
  constructor(private readonly seederService: SeederService) {
    super();
  }

  async run(): Promise<void> {
    console.log('Seeding database...');
    const result = await this.seederService.seed();
    console.log('Seeding completed:', result);
  }
}