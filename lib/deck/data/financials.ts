// Financial Projections

export const financialProjections = [
  {
    year: 1,
    customers: 10000,
    ordersPerDay: '100-200',
    gmv: 5000000, // $5M USD
    revenue: 500000,
    takeRate: 0.10,
    netIncome: -1000000,
    margin: -2.0,
    raised: 500000,
    cumulative: 500000,
    valuation: 3000000,
  },
  {
    year: 2,
    customers: 50000,
    ordersPerDay: '1,000-1,500',
    gmv: 30000000,
    revenue: 3500000,
    takeRate: 0.117,
    netIncome: -500000,
    margin: -0.14,
    raised: 2000000,
    cumulative: 2500000,
    valuation: 12500000,
  },
  {
    year: 3,
    customers: 200000,
    ordersPerDay: '3,000-5,000',
    gmv: 100000000,
    revenue: 10000000,
    takeRate: 0.10,
    netIncome: 1000000,
    margin: 0.10,
    raised: 5000000,
    cumulative: 7500000,
    valuation: 35000000,
  },
];

export const useOfFunds = {
  seed: {
    total: 500000,
    breakdown: [
      { category: 'Technology', amount: 150000, percentage: 0.30, color: '#25D366' },
      { category: 'Marketing', amount: 150000, percentage: 0.30, color: '#128C7E' },
      { category: 'Operations', amount: 100000, percentage: 0.20, color: '#FF6B35' },
      { category: 'Working Capital', amount: 100000, percentage: 0.20, color: '#2C3E50' },
    ],
  },
};

export const investorReturns = {
  seed: {
    investment: 500000,
    equity: 0.167, // 16.7%
    preMoney: 3000000,
    postMoney: 3500000,
  },
  year3Exit: {
    valuation: 35000000,
    multiple: 11.3,
    description: 'Base Case - Year 3',
  },
  year5Exit: {
    valuation: 300000000,
    multiple: 96.9,
    description: 'IPO - Year 5',
  },
  acquisition: {
    valuation: 100000000, // $50-150M range
    multiple: 33,
    description: 'Acquisition by Rappi - Year 3-4',
  },
};

export const breakEvenAnalysis = {
  fixedCostsMonthly: 55000, // USD
  variableCostPerOrder: 1.38, // USD
  revenuePerOrder: 2.53, // USD
  contributionMargin: 1.15, // USD
  breakEvenOrdersPerDay: 1598,
  achievedInYear: 2,
};

export const goToMarketPhases = [
  {
    phase: 1,
    name: 'Bogotá Beachhead',
    duration: 'Months 1-6',
    geography: 'Zona T + Chicó',
    customers: '500 → 10K',
    ordersPerDay: '20 → 200',
    strategy: 'Prove model, word-of-mouth, guerrilla marketing',
  },
  {
    phase: 2,
    name: 'Bogotá Expansion',
    duration: 'Months 7-12',
    geography: '+5 neighborhoods',
    customers: '10K → 50K',
    ordersPerDay: '200 → 1,500',
    strategy: 'Referral program, restaurant co-marketing',
  },
  {
    phase: 3,
    name: 'Multi-City',
    duration: 'Year 2',
    geography: 'Medellín + Cali',
    customers: '50K → 200K',
    ordersPerDay: '1,500 → 5,000',
    strategy: 'TV/radio, national campaigns',
  },
  {
    phase: 4,
    name: 'National',
    duration: 'Year 3',
    geography: '10+ cities',
    customers: '200K+',
    ordersPerDay: '5,000+',
    strategy: 'Profitable, sustainable, defensible',
  },
];

export const capitalEfficiency = {
  weats: {
    totalRaised: 7500000,
    year3GMV: 100000000,
    gmvPerDollar: 13.33,
  },
  rappi: {
    totalRaised: 2460000000,
    gmv: 3170000000,
    gmvPerDollar: 1.29,
  },
};
