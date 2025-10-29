import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Staff, StaffRole } from '../../entities/staff.entity';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private jwtService: JwtService,
  ) {}

  async validateStaff(email: string, password: string): Promise<Staff | null> {
    const staff = await this.staffRepository.findOne({ where: { email, isActive: true } });
    if (staff && await bcrypt.compare(password, staff.password)) {
      // Remove password from returned object
      const { password, ...result } = staff;
      return result as Staff;
    }
    return null;
  }

  async login(staff: Staff) {
    const payload = { 
      email: staff.email, 
      sub: staff.id,
      role: staff.role
    };
    return {
      access_token: this.jwtService.sign(payload),
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role
      }
    };
  }

  async register(staffData: Partial<Staff>): Promise<Staff> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(staffData.password, this.SALT_ROUNDS);
    
    // Create staff member
    const staff = this.staffRepository.create({
      ...staffData,
      password: hashedPassword
    });
    
    return await this.staffRepository.save(staff);
  }

  async changePassword(staffId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    const staff = await this.staffRepository.findOne({ where: { id: staffId } });
    if (!staff) {
      throw new UnauthorizedException('Staff not found');
    }

    // Verify old password
    if (!(await bcrypt.compare(oldPassword, staff.password))) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Update with new password
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS);
    await this.staffRepository.update(staffId, { password: hashedPassword });
    
    return true;
  }

  async getStaffById(id: number): Promise<Staff | null> {
    return await this.staffRepository.findOne({ where: { id, isActive: true } });
  }

  async getStaffByRole(role: StaffRole): Promise<Staff[]> {
    return await this.staffRepository.find({ where: { role, isActive: true } });
  }

  async updateStaff(id: number, staffData: Partial<Staff>): Promise<Staff | null> {
    // If password is being updated, hash it
    if (staffData.password) {
      staffData.password = await bcrypt.hash(staffData.password, this.SALT_ROUNDS);
    }
    
    await this.staffRepository.update(id, staffData);
    return await this.staffRepository.findOne({ where: { id } });
  }
}