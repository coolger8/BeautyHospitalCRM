import { Controller, Post, Get, Body, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Staff } from '../../entities/staff.entity';
import { StaffRole } from '../../entities/staff.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    const staff = await this.authService.validateStaff(loginData.email, loginData.password);
    if (!staff) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(staff);
  }

  @Post('register')
  async register(@Body() staffData: Partial<Staff>) {
    return await this.authService.register(staffData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Post('staff')
  async createStaff(@Body() staffData: Partial<Staff>) {
    return await this.authService.register(staffData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password/:id')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() passwordData: { oldPassword: string; newPassword: string }
  ) {
    const result = await this.authService.changePassword(
      id, 
      passwordData.oldPassword, 
      passwordData.newPassword
    );
    return { success: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.getStaffById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Get('staff/role/:role')
  async getStaffByRole(@Param('role') role: StaffRole) {
    return await this.authService.getStaffByRole(role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(StaffRole.ADMIN)
  @Put('staff/:id')
  async updateStaff(
    @Param('id', ParseIntPipe) id: number,
    @Body() staffData: Partial<Staff>
  ) {
    return await this.authService.updateStaff(id, staffData);
  }
}