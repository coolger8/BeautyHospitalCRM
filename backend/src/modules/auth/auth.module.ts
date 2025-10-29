import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from '../../entities/staff.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { RepositoriesModule } from '../../repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
    RepositoriesModule
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}