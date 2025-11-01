'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Dashboard
    'dashboard.title': 'Beauty Hospital CRM',
    'dashboard.welcome': 'Welcome to the Beauty Hospital CRM System',
    'dashboard.navigation': 'Navigation',
    'dashboard.dashboard': 'Dashboard',
    'dashboard.customers': 'Customers',
    'dashboard.consultations': 'Consultations',
    'dashboard.appointments': 'Appointments',
    'dashboard.treatments': 'Treatments',
    'dashboard.memberships': 'Memberships',
    'dashboard.campaigns': 'Campaigns',
    'dashboard.orders': 'Orders',
    'dashboard.staff': 'Staff',
    'dashboard.notifications': 'Notifications',
    'dashboard.logout': 'Logout',
    'dashboard.adminUser': 'Admin User',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.add': 'Add',
    'common.back': 'Back',
    'common.confirm': 'Confirm',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.id': 'ID',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.startDate': 'Start Date',
    'common.endDate': 'End Date',
    'common.date': 'Date',
    'common.createdAt': 'Created At',
    'common.updatedAt': 'Last Updated',
    
    // Staff
    'staff.management': 'Staff Management',
    'staff.addNew': 'Add New Staff',
    'staff.personalInfo': 'Personal Information',
    'staff.accountDetails': 'Account Details',
    'staff.fullName': 'Full Name',
    'staff.email': 'Email',
    'staff.phone': 'Phone',
    'staff.role': 'Role',
    'staff.status': 'Status',
    'staff.active': 'Active',
    'staff.inactive': 'Inactive',
    'staff.password': 'Password',
    'staff.confirmPassword': 'Confirm Password',
    'staff.activeStatus': 'Active Status',
    'staff.createdAt': 'Created At',
    'staff.updatedAt': 'Last Updated',
    'staff.deactivate': 'Deactivate Staff',
    'staff.activate': 'Activate Staff',
    
    // Customers
    'customers.management': 'Customer Management',
    'customers.addNew': 'Add New Customer',
    'customers.personalInfo': 'Personal Information',
    'customers.contactInfo': 'Contact Information',
    'customers.gender': 'Gender',
    'customers.age': 'Age',
    'customers.phone': 'Phone',
    'customers.email': 'Email',
    'customers.address': 'Address',
    'customers.source': 'Source',
    'customers.valueLevel': 'Value Level',
    'customers.consumptionLevel': 'Consumption Level',
    'customers.demandType': 'Demand Type',
    
    // Appointments
    'appointments.management': 'Appointment Management',
    'appointments.addNew': 'Add New Appointment',
    'appointments.schedule': 'Schedule',
    'appointments.customer': 'Customer',
    'appointments.treatment': 'Treatment',
    'appointments.consultant': 'Consultant',
    'appointments.status': 'Status',
    'appointments.pending': 'Pending',
    'appointments.confirmed': 'Confirmed',
    'appointments.scheduled': 'Scheduled',
    'appointments.completed': 'Completed',
    'appointments.cancelled': 'Cancelled',
    'appointments.date': 'Date',
    'appointments.time': 'Time',
    
    // Treatments
    'treatments.management': 'Treatment Management',
    'treatments.addNew': 'Add New Treatment',
    'treatments.treatmentInfo': 'Treatment Information',
    'treatments.category': 'Category',
    'treatments.duration': 'Duration',
    'treatments.price': 'Price',
    'treatments.cost': 'Cost',
    
    // Consultations
    'consultations.management': 'Consultation Management',
    'consultations.addNew': 'Add New Consultation',
    'consultations.consultationInfo': 'Consultation Information',
    'consultations.customer': 'Customer',
    'consultations.consultant': 'Consultant',
    'consultations.treatment': 'Treatment',
    'consultations.notes': 'Notes',
    'consultations.recommendations': 'Recommendations',
    
    // Memberships
    'memberships.management': 'Membership Management',
    'memberships.addNew': 'Add New Membership',
    'memberships.membershipInfo': 'Membership Information',
    'memberships.customer': 'Customer',
    'memberships.level': 'Level',
    'memberships.points': 'Points',
    'memberships.balance': 'Balance',
    'memberships.expiryDate': 'Expiry Date',
    'memberships.normal': 'Normal',
    'memberships.silver': 'Silver',
    'memberships.gold': 'Gold',
    'memberships.platinum': 'Platinum',
    
    // Campaigns
    'campaigns.management': 'Campaign Management',
    'campaigns.addNew': 'Add New Campaign',
    'campaigns.campaignInfo': 'Campaign Information',
    'campaigns.target': 'Target',
    'campaigns.discount': 'Discount',
    'campaigns.percentage': 'Percentage',
    'campaigns.fixedAmount': 'Fixed Amount',
    
    // Orders
    'orders.management': 'Order Management',
    'orders.addNew': 'Add New Order',
    'orders.orderInfo': 'Order Information',
    'orders.customer': 'Customer',
    'orders.treatment': 'Treatment',
    'orders.consultant': 'Consultant',
    'orders.amount': 'Amount',
    'orders.paymentStatus': 'Payment Status',
    'orders.paymentMethod': 'Payment Method',
    'orders.pending_payment': 'Pending Payment',
    'orders.paid': 'Paid',
    'orders.completed': 'Completed',
    'orders.refunded': 'Refunded',
    'orders.wechat': 'WeChat Pay',
    'orders.alipay': 'Alipay',
    'orders.card': 'Credit Card',
    'orders.cash': 'Cash',
    
    // Login
    'login.title': 'Login to Your Account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.rememberMe': 'Remember Me',
    'login.forgotPassword': 'Forgot Password?',
    'login.button': 'Login',
    'login.defaultCredentials': 'Default admin account: admin@beautyhospital.com / admin123',
  },
  zh: {
    // Dashboard
    'dashboard.title': '美容医院CRM系统',
    'dashboard.welcome': '欢迎使用美容医院客户关系管理系统',
    'dashboard.navigation': '导航',
    'dashboard.dashboard': '仪表板',
    'dashboard.customers': '客户管理',
    'dashboard.consultations': '咨询管理',
    'dashboard.appointments': '预约管理',
    'dashboard.treatments': '治疗管理',
    'dashboard.memberships': '会员管理',
    'dashboard.campaigns': '营销活动',
    'dashboard.orders': '订单管理',
    'dashboard.staff': '员工管理',
    'dashboard.notifications': '通知',
    'dashboard.logout': '退出登录',
    'dashboard.adminUser': '管理员',
    
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.view': '查看',
    'common.create': '创建',
    'common.update': '更新',
    'common.add': '添加',
    'common.back': '返回',
    'common.confirm': '确认',
    'common.actions': '操作',
    'common.status': '状态',
    'common.active': '激活',
    'common.inactive': '未激活',
    'common.id': 'ID',
    'common.name': '名称',
    'common.description': '描述',
    'common.startDate': '开始日期',
    'common.endDate': '结束日期',
    'common.date': '日期',
    'common.createdAt': '创建时间',
    'common.updatedAt': '最后更新',
    
    // Staff
    'staff.management': '员工管理',
    'staff.addNew': '添加新员工',
    'staff.personalInfo': '个人信息',
    'staff.accountDetails': '账户详情',
    'staff.fullName': '姓名',
    'staff.email': '邮箱',
    'staff.phone': '电话',
    'staff.role': '角色',
    'staff.status': '状态',
    'staff.active': '激活',
    'staff.inactive': '未激活',
    'staff.password': '密码',
    'staff.confirmPassword': '确认密码',
    'staff.activeStatus': '激活状态',
    'staff.createdAt': '创建时间',
    'staff.updatedAt': '最后更新',
    'staff.deactivate': '停用员工',
    'staff.activate': '激活员工',
    
    // Customers
    'customers.management': '客户管理',
    'customers.addNew': '添加新客户',
    'customers.personalInfo': '个人信息',
    'customers.contactInfo': '联系信息',
    'customers.gender': '性别',
    'customers.age': '年龄',
    'customers.phone': '电话',
    'customers.email': '邮箱',
    'customers.address': '地址',
    'customers.source': '来源',
    'customers.valueLevel': '价值等级',
    'customers.consumptionLevel': '消费等级',
    'customers.demandType': '需求类型',
    
    // Appointments
    'appointments.management': '预约管理',
    'appointments.addNew': '添加新预约',
    'appointments.schedule': '时间安排',
    'appointments.customer': '客户',
    'appointments.treatment': '治疗项目',
    'appointments.consultant': '咨询师',
    'appointments.status': '状态',
    'appointments.pending': '待处理',
    'appointments.confirmed': '已确认',
    'appointments.scheduled': '已预约',
    'appointments.completed': '已完成',
    'appointments.cancelled': '已取消',
    'appointments.date': '日期',
    'appointments.time': '时间',
    
    // Treatments
    'treatments.management': '治疗管理',
    'treatments.addNew': '添加新治疗项目',
    'treatments.treatmentInfo': '治疗信息',
    'treatments.category': '类别',
    'treatments.duration': '时长',
    'treatments.price': '价格',
    'treatments.cost': '成本',
    
    // Consultations
    'consultations.management': '咨询管理',
    'consultations.addNew': '添加新咨询',
    'consultations.consultationInfo': '咨询信息',
    'consultations.customer': '客户',
    'consultations.consultant': '咨询师',
    'consultations.treatment': '治疗项目',
    'consultations.notes': '备注',
    'consultations.recommendations': '建议',
    
    // Memberships
    'memberships.management': '会员管理',
    'memberships.addNew': '添加新会员',
    'memberships.membershipInfo': '会员信息',
    'memberships.customer': '客户',
    'memberships.level': '等级',
    'memberships.points': '积分',
    'memberships.balance': '余额',
    'memberships.expiryDate': '到期日期',
    'memberships.normal': '普通',
    'memberships.silver': '银卡',
    'memberships.gold': '金卡',
    'memberships.platinum': '白金卡',
    
    // Campaigns
    'campaigns.management': '营销活动管理',
    'campaigns.addNew': '添加新活动',
    'campaigns.campaignInfo': '活动信息',
    'campaigns.target': '目标',
    'campaigns.discount': '折扣',
    'campaigns.percentage': '百分比',
    'campaigns.fixedAmount': '固定金额',
    
    // Orders
    'orders.management': '订单管理',
    'orders.addNew': '添加新订单',
    'orders.orderInfo': '订单信息',
    'orders.customer': '客户',
    'orders.treatment': '治疗项目',
    'orders.consultant': '咨询师',
    'orders.amount': '金额',
    'orders.paymentStatus': '支付状态',
    'orders.paymentMethod': '支付方式',
    'orders.pending_payment': '待支付',
    'orders.paid': '已支付',
    'orders.completed': '已完成',
    'orders.refunded': '已退款',
    'orders.wechat': '微信支付',
    'orders.alipay': '支付宝',
    'orders.card': '信用卡',
    'orders.cash': '现金',
    
    // Login
    'login.title': '登录您的账户',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.rememberMe': '记住我',
    'login.forgotPassword': '忘记密码?',
    'login.button': '登录',
    'login.defaultCredentials': '默认管理员账号: admin@beautyhospital.com / admin123',
  }
};

// Type for translation keys
type TranslationKey = keyof typeof translations.en;

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Check localStorage for saved language preference
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language | null;
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  const t = (key: string): string => {
    const typedKey = key as TranslationKey;
    return translations[language][typedKey] || translations.en[typedKey] || key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};