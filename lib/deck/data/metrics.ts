// Unit Economics and Key Metrics

export const unitEconomics = {
  wpfoods: {
    revenue: 10440, // COP per order
    costs: 6890,
    profit: 3550,
    margin: 0.34,
    takeRate: 0.084, // 8.4%
  },
  rappi: {
    revenue: 54820,
    costs: 25670,
    profit: 29150,
    margin: 0.532,
    takeRate: 0.44, // 44%
  },
};

export const customerSavings = {
  wpfoods: 127000, // Total customer pays (COP)
  rappi: 163000,
  savings: 36000,
  savingsPercent: 0.22, // 22% cheaper
};

export const restaurantFees = {
  wpfoods: {
    commission: 0.06, // 6%
    totalFees: 0.06,
    keepPercentage: 0.927, // 92.7%
  },
  rappi: {
    commission: 0.25, // 25%
    totalFees: 0.30, // 30% all-in
    keepPercentage: 0.70, // 70%
  },
};

export const workerEarnings = {
  wpfoods: {
    perDelivery: 3900, // COP
    netPerDay: 82000, // After expenses
    monthlyNet: 2460000, // Full-time
  },
  rappi: {
    perDelivery: 2500,
    netPerDay: 20000,
    monthlyNet: 600000,
  },
};

export const costAdvantage = {
  wpfoods: {
    delivery: 0.047, // 4.7% of GMV
    technology: 0.005, // 0.5%
    support: 0.001, // 0.1%
    marketing: 0.010, // 1.0%
    totalOpex: 0.095, // 9.5%
  },
  rappi: {
    delivery: 0.10,
    technology: 0.025,
    support: 0.015,
    marketing: 0.040,
    totalOpex: 0.27, // 27%
  },
};

export const keyMetrics = {
  whatsappPenetration: 0.90, // 90% in Colombia
  aiAutomation: 0.90, // 90% of support
  onboardingTime: 30, // seconds
  orderingTime: 30, // seconds
  rappiOrderingTime: 300, // 5 minutes
  capitalEfficiency: 10.3, // 10.3x better than Rappi
};

export const competitiveAdvantages = [
  {
    title: 'Cost Structure',
    wpfoods: '9.5% of GMV',
    rappi: '27% of GMV',
    advantage: '91% lower costs',
  },
  {
    title: 'Customer Fees',
    wpfoods: '$0',
    rappi: '15-20%',
    advantage: '100% savings',
  },
  {
    title: 'Restaurant Commission',
    wpfoods: '5-10%',
    rappi: '25-35%',
    advantage: '76% lower',
  },
  {
    title: 'Worker Pay',
    wpfoods: '$3,900 COP',
    rappi: '$2,500 COP',
    advantage: '56% higher',
  },
];
