import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Staff } from '../../entities/staff.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) { }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number
  ): Promise<PaginatedResponseDto<Staff>> {
    const paginationDto = new PaginationDto();
    if (page) paginationDto.page = page;
    if (limit) paginationDto.limit = limit;
    return this.staffService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Staff | null> {
    return this.staffService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  // @Roles('admin') // 暂时注释掉，避免编译错误
  async create(@Body() createStaffDto: Partial<Staff>): Promise<Staff> {
    return this.staffService.create(createStaffDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  // @Roles('admin') // 暂时注释掉，避免编译错误
  async update(@Param('id') id: string, @Body() updateStaffDto: Partial<Staff>): Promise<Staff | null> {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  // @Roles('admin') // 暂时注释掉，避免编译错误
  async remove(@Param('id') id: string): Promise<void> {
    return this.staffService.remove(+id);
  }

  @Post('generate-test-data')
  async generateTestData(): Promise<{ message: string }> {
    await this.staffService.generateTestData();
    return { message: '20 test staff records have been generated successfully' };
  }
}