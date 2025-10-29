import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Customer, CustomerSource, CustomerValueLevel, ConsumptionLevel, DemandType } from '../entities/customer.entity';
import { Consultation } from '../entities/consultation.entity';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Treatment } from '../entities/treatment.entity';
import { Staff, StaffRole } from '../entities/staff.entity';
import { Membership, MembershipLevel } from '../entities/membership.entity';
import { Project, ProjectCategory } from '../entities/project.entity';
import { Order, OrderStatus, PaymentMethod } from '../entities/order.entity';
import { Campaign } from '../entities/campaign.entity';

@Injectable()
export class SeederService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Treatment)
    private treatmentRepository: Repository<Treatment>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  async seed() {
    // Clear existing data
    await this.campaignRepository.clear();
    await this.orderRepository.clear();
    await this.projectRepository.clear();
    await this.membershipRepository.clear();
    await this.staffRepository.clear();
    await this.treatmentRepository.clear();
    await this.appointmentRepository.clear();
    await this.consultationRepository.clear();
    await this.customerRepository.clear();

    // Seed staff
    const staffMembers = await this.seedStaff();
    
    // Seed customers
    const customers = await this.seedCustomers();
    
    // Seed memberships
    const memberships = await this.seedMemberships(customers);
    
    // Seed projects
    const projects = await this.seedProjects();
    
    // Seed consultations
    const consultations = await this.seedConsultations(customers, staffMembers);
    
    // Seed appointments
    const appointments = await this.seedAppointments(customers, staffMembers, projects);
    
    // Seed treatments
    const treatments = await this.seedTreatments(customers, staffMembers, consultations);
    
    // Seed orders
    const orders = await this.seedOrders(customers, projects, staffMembers);
    
    // Seed campaigns
    const campaigns = await this.seedCampaigns();

    return {
      staff: staffMembers.length,
      customers: customers.length,
      memberships: memberships.length,
      projects: projects.length,
      consultations: consultations.length,
      appointments: appointments.length,
      treatments: treatments.length,
      orders: orders.length,
      campaigns: campaigns.length
    };
  }

  private async seedStaff(): Promise<Staff[]> {
    const staffData: Partial<Staff>[] = [
      {
        name: 'Admin User',
        email: 'admin@beautyhospital.com',
        phone: '13800138000',
        role: 'admin' as StaffRole,
        password: await bcrypt.hash('admin123', this.SALT_ROUNDS),
        isActive: true
      },
      {
        name: 'Consultant Zhang',
        email: 'zhang@beautyhospital.com',
        phone: '13800138001',
        role: 'consultant' as StaffRole,
        password: await bcrypt.hash('consultant123', this.SALT_ROUNDS),
        isActive: true
      },
      {
        name: 'Doctor Li',
        email: 'li@beautyhospital.com',
        phone: '13800138002',
        role: 'doctor' as StaffRole,
        password: await bcrypt.hash('doctor123', this.SALT_ROUNDS),
        isActive: true
      },
      {
        name: 'Nurse Wang',
        email: 'wang@beautyhospital.com',
        phone: '13800138003',
        role: 'nurse' as StaffRole,
        password: await bcrypt.hash('nurse123', this.SALT_ROUNDS),
        isActive: true
      }
    ];

    const staffMembers: Staff[] = [];
    for (const staff of staffData) {
      const existing = await this.staffRepository.findOne({ where: { email: staff.email } });
      if (!existing) {
        const newStaff = this.staffRepository.create(staff);
        staffMembers.push(await this.staffRepository.save(newStaff));
      } else {
        staffMembers.push(existing);
      }
    }
    return staffMembers;
  }

  private async seedCustomers(): Promise<Customer[]> {
    const customerData: Partial<Customer>[] = [];
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
                  'Kate', 'Liam', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Steve', 'Tina'];
    
    const sources = ['advertisement', 'meituan', 'referral', 'other'];
    const valueLevels = ['bronze', 'silver', 'gold', 'platinum'];
    const consumptionLevels = ['low', 'medium', 'high'];
    const demandTypes = ['anti_aging', 'plastic_surgery', 'skin_management', 'other'];

    for (let i = 0; i < 20; i++) {
      customerData.push({
        name: names[i],
        gender: i % 2 === 0 ? 'Female' : 'Male',
        age: 20 + (i % 40),
        phone: `138001380${String(i).padStart(2, '0')}`,
        email: `customer${i}@example.com`,
        address: `Address ${i}`,
        source: sources[i % sources.length] as CustomerSource,
        valueLevel: valueLevels[i % valueLevels.length] as CustomerValueLevel,
        consumptionLevel: consumptionLevels[i % consumptionLevels.length] as ConsumptionLevel,
        demandType: demandTypes[i % demandTypes.length] as DemandType,
        allergyHistory: i % 5 === 0 ? `Allergy ${i}` : undefined,
        contraindications: i % 7 === 0 ? `Contraindication ${i}` : undefined,
        consumptionPreference: `Preference ${i}`,
        visitFrequency: Math.floor(Math.random() * 10),
        satisfactionScore: Math.floor(Math.random() * 10) + 1,
        relatedCustomerId: i > 0 && i % 5 === 0 ? Math.floor(Math.random() * i) + 1 : undefined,
        isEncrypted: false
      });
    }

    const customers: Customer[] = [];
    for (const customer of customerData) {
      const existing = await this.customerRepository.findOne({ where: { phone: customer.phone } });
      if (!existing) {
        const newCustomer = this.customerRepository.create(customer);
        customers.push(await this.customerRepository.save(newCustomer));
      } else {
        customers.push(existing);
      }
    }
    return customers;
  }

  private async seedMemberships(customers: Customer[]): Promise<Membership[]> {
    const membershipData: Partial<Membership>[] = [];
    
    for (let i = 0; i < customers.length; i++) {
      const levels = ['normal', 'silver', 'gold', 'platinum'];
      
      membershipData.push({
        customerId: customers[i].id,
        level: levels[i % levels.length] as MembershipLevel,
        points: Math.floor(Math.random() * 1000),
        balance: Math.floor(Math.random() * 10000) / 100,
        expiryDate: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year from now
        isActive: true
      });
    }

    const memberships: Membership[] = [];
    for (const membership of membershipData) {
      const existing = await this.membershipRepository.findOne({ where: { customerId: membership.customerId } });
      if (!existing) {
        const newMembership = this.membershipRepository.create(membership);
        memberships.push(await this.membershipRepository.save(newMembership));
      } else {
        memberships.push(existing);
      }
    }
    return memberships;
  }

  private async seedProjects(): Promise<Project[]> {
    const projectData: Partial<Project>[] = [
      {
        name: 'Skin Whitening Treatment',
        description: 'Advanced skin whitening treatment using laser technology',
        category: 'skin_care' as ProjectCategory,
        basePrice: 1500.00,
        isActive: true
      },
      {
        name: 'Botox Injection',
        description: 'Botox injection for wrinkle reduction',
        category: 'injectables' as ProjectCategory,
        basePrice: 2000.00,
        isActive: true
      },
      {
        name: 'Liposuction',
        description: 'Body contouring through liposuction surgery',
        category: 'surgery' as ProjectCategory,
        basePrice: 15000.00,
        isActive: true
      },
      {
        name: 'Laser Hair Removal',
        description: 'Permanent hair removal using laser technology',
        category: 'laser' as ProjectCategory,
        basePrice: 800.00,
        isActive: true
      },
      {
        name: 'Facial Rejuvenation',
        description: 'Complete facial rejuvenation treatment',
        category: 'skin_care' as ProjectCategory,
        basePrice: 3000.00,
        isActive: true
      }
    ];

    const projects: Project[] = [];
    for (const project of projectData) {
      const existing = await this.projectRepository.findOne({ where: { name: project.name } });
      if (!existing) {
        const newProject = this.projectRepository.create(project);
        projects.push(await this.projectRepository.save(newProject));
      } else {
        projects.push(existing);
      }
    }
    return projects;
  }

  private async seedConsultations(customers: Customer[], staffMembers: Staff[]): Promise<Consultation[]> {
    const consultationData: Partial<Consultation>[] = [];
    const consultants = staffMembers.filter(staff => staff.role === 'consultant');
    
    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length];
      const consultant = consultants[i % consultants.length];
      
      consultationData.push({
        customerId: customer.id,
        consultantId: consultant.id,
        communicationContent: `Consultation content for ${customer.name} with ${consultant.name}`,
        recommendedProject: `Recommended project ${i % 5}`,
        quotedPrice: 1000 + (i * 100),
        communicationScreenshot: undefined,
        referenceImage: undefined,
        diagnosisContent: `Diagnosis content for ${customer.name}`,
        skinTestResult: `Skin test result ${i}`,
        aestheticDesign: `Aesthetic design ${i}`,
        preoperativePhoto: undefined,
        postoperativeSimulation: undefined,
        consentForm: undefined,
        isConsentSigned: i % 3 !== 0
      });
    }

    const consultations: Consultation[] = [];
    for (const consultation of consultationData) {
      const newConsultation = this.consultationRepository.create(consultation);
      consultations.push(await this.consultationRepository.save(newConsultation));
    }
    return consultations;
  }

  private async seedAppointments(customers: Customer[], staffMembers: Staff[], projects: Project[]): Promise<Appointment[]> {
    const appointmentData: Partial<Appointment>[] = [];
    
    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length];
      const staff = staffMembers[i % staffMembers.length];
      const project = projects[i % projects.length];
      
      const scheduledTime = new Date();
      scheduledTime.setDate(scheduledTime.getDate() + (i % 30));
      
      const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      
      appointmentData.push({
        customerId: customer.id,
        assignedStaffId: staff.id,
        projectId: project.id,
        scheduledTime: scheduledTime,
        status: statuses[i % statuses.length] as AppointmentStatus,
        notes: `Appointment notes ${i}`
      });
    }

    const appointments: Appointment[] = [];
    for (const appointment of appointmentData) {
      const newAppointment = this.appointmentRepository.create(appointment);
      appointments.push(await this.appointmentRepository.save(newAppointment));
    }
    return appointments;
  }

  private async seedTreatments(customers: Customer[], staffMembers: Staff[], consultations: Consultation[]): Promise<Treatment[]> {
    const treatmentData: Partial<Treatment>[] = [];
    const doctors = staffMembers.filter(staff => staff.role === 'doctor');
    const nurses = staffMembers.filter(staff => staff.role === 'nurse');
    
    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length];
      const consultation = consultations[i % consultations.length];
      const doctor = doctors[i % doctors.length];
      const nurse = nurses[i % nurses.length];
      
      const treatmentTime = new Date();
      treatmentTime.setDate(treatmentTime.getDate() - (i % 30));
      
      treatmentData.push({
        customerId: customer.id,
        consultationId: consultation.id,
        doctorId: doctor.id,
        nurseId: nurse.id,
        projectId: (i % 5) + 1,
        productName: `Product ${i}`,
        dosage: `${i * 10}ml`,
        treatmentTime: treatmentTime,
        recoveryNotes: `Recovery notes ${i}`,
        rednessLevel: i % 10,
        customerFeedback: `Feedback ${i}`,
        nextTreatmentTime: i % 3 === 0 ? new Date(treatmentTime.getTime() + (7 * 24 * 60 * 60 * 1000)) : undefined,
        treatmentSequence: (i % 6) + 1,
        totalTreatments: 6
      });
    }

    const treatments: Treatment[] = [];
    for (const treatment of treatmentData) {
      const newTreatment = this.treatmentRepository.create(treatment);
      treatments.push(await this.treatmentRepository.save(newTreatment));
    }
    return treatments;
  }

  private async seedOrders(customers: Customer[], projects: Project[], staffMembers: Staff[]): Promise<Order[]> {
    const orderData: Partial<Order>[] = [];
    const consultants = staffMembers.filter(staff => staff.role === 'consultant');
    
    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length];
      const project = projects[i % projects.length];
      const consultant = consultants[i % consultants.length];
      
      const statuses = ['pending_payment', 'paid', 'completed', 'refunded'];
      const paymentMethods = ['wechat', 'alipay', 'card', 'cash'];
      
      const amount = 1000 + (i * 100);
      const discount = i % 5 === 0 ? 100 : 0;
      
      orderData.push({
        customerId: customer.id,
        projectId: project.id,
        consultantId: consultant.id,
        status: statuses[i % statuses.length] as OrderStatus,
        paymentMethod: paymentMethods[i % paymentMethods.length] as PaymentMethod,
        amount: amount,
        discountAmount: discount,
        finalAmount: amount - discount,
        discountApproverId: i % 4 === 0 ? staffMembers[0].id : undefined,
        notes: `Order notes ${i}`
      });
    }

    const orders: Order[] = [];
    for (const order of orderData) {
      const newOrder = this.orderRepository.create(order);
      orders.push(await this.orderRepository.save(newOrder));
    }
    return orders;
  }

  private async seedCampaigns(): Promise<Campaign[]> {
    const campaignData: Partial<Campaign>[] = [
      {
        name: 'Summer Sale',
        description: 'Special summer discount for all services',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        targetCustomerCriteria: 'All customers',
        discountPercentage: 15.0,
        fixedDiscount: undefined,
        isActive: true
      },
      {
        name: 'New Customer Welcome',
        description: 'Special offer for new customers',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        targetCustomerCriteria: 'New customers only',
        discountPercentage: 20.0,
        fixedDiscount: undefined,
        isActive: true
      },
      {
        name: 'Member Loyalty Program',
        description: 'Exclusive discounts for loyal members',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        targetCustomerCriteria: 'Gold and Platinum members',
        discountPercentage: 10.0,
        fixedDiscount: undefined,
        isActive: true
      }
    ];

    const campaigns: Campaign[] = [];
    for (const campaign of campaignData) {
      const existing = await this.campaignRepository.findOne({ where: { name: campaign.name } });
      if (!existing) {
        const newCampaign = this.campaignRepository.create(campaign);
        campaigns.push(await this.campaignRepository.save(newCampaign));
      } else {
        campaigns.push(existing);
      }
    }
    return campaigns;
  }
}