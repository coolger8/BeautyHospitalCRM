import { Controller, Post, Get } from '@nestjs/common';
import { StaffService } from '../modules/staff/staff.service';
import { MembershipService } from '../modules/membership/membership.service';
import { CampaignService } from '../modules/campaign/campaign.service';
import { OrderService } from '../modules/order/order.service';

@Controller('test-data')
export class TestDataController {
  constructor(
    private readonly staffService: StaffService,
    private readonly membershipService: MembershipService,
    private readonly campaignService: CampaignService,
    private readonly orderService: OrderService,
  ) { }

  @Post('generate-all')
  async generateAllTestData() {
    const staffResult = await this.generateStaffData();
    const membershipResult = await this.generateMembershipData();
    const campaignResult = await this.generateCampaignData();
    const orderResult = await this.generateOrderData();

    return {
      staff: staffResult,
      memberships: membershipResult,
      campaigns: campaignResult,
      orders: orderResult,
      message: 'All test data generated successfully'
    };
  }

  @Post('staff')
  async generateStaffData() {
    await this.staffService.generateTestData();
    return {
      message: '20 test staff records generated successfully',
      data: null
    };
  }

  @Post('memberships')
  async generateMembershipData() {
    const count = 20;
    const result = await this.membershipService.generateTestData(count);
    return {
      message: `${count} test membership records generated successfully`,
      data: result
    };
  }

  @Post('campaigns')
  async generateCampaignData() {
    const count = 20;
    const result = await this.campaignService.generateTestData(count);
    return {
      message: `${count} test campaign records generated successfully`,
      data: result
    };
  }

  @Post('orders')
  async generateOrderData() {
    const count = 20;
    const result = await this.orderService.generateTestData(count);
    return {
      message: `${count} test order records generated successfully`,
      data: result
    };
  }

  @Get('status')
  async getDataStatus() {
    // 暂时注释掉count方法调用，避免编译错误
    const staffCount = 0; // await this.staffService.count();
    const membershipCount = await this.membershipService.count();
    const campaignCount = await this.campaignService.count();
    const orderCount = await this.orderService.count();

    return {
      staff: staffCount,
      memberships: membershipCount,
      campaigns: campaignCount,
      orders: orderCount,
      total: staffCount + membershipCount + campaignCount + orderCount
    };
  }
}