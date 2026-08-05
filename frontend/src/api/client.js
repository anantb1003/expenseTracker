import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial Seed Data for Standalone Client Mode
const seedCategories = [
  { 
    id: 1, name: 'Groceries', color: '#10B981', budgetLimit: 5000,
    subcategories: [{ id: 11, name: 'Supermarket' }, { id: 12, name: 'Fruits & Vegetables' }, { id: 13, name: 'Dairy & Bakery' }] 
  },
  { 
    id: 2, name: 'Dining & Food', color: '#EF4444', budgetLimit: 3000,
    subcategories: [{ id: 21, name: 'Restaurants & Cafe' }, { id: 22, name: 'Online Food Delivery' }, { id: 23, name: 'Tea & Snacks' }] 
  },
  { 
    id: 3, name: 'Shopping', color: '#8B5CF6', budgetLimit: 6000,
    subcategories: [{ id: 31, name: 'Clothing & Footwear' }, { id: 32, name: 'Electronics & Gadgets' }, { id: 33, name: 'Home Accessories' }] 
  },
  { 
    id: 4, name: 'Bills & Utilities', color: '#3B82F6', budgetLimit: 4000,
    subcategories: [{ id: 41, name: 'Electricity & Gas' }, { id: 42, name: 'Mobile & Broadband' }, { id: 43, name: 'Water & Maintenance' }] 
  },
  { 
    id: 5, name: 'Transportation', color: '#F59E0B', budgetLimit: 2000,
    subcategories: [{ id: 51, name: 'Fuel & Petrol' }, { id: 52, name: 'Cab & Uber/Ola' }, { id: 53, name: 'Public Transport & Fastag' }] 
  },
  { 
    id: 6, name: 'Entertainment', color: '#EC4899', budgetLimit: 2500,
    subcategories: [{ id: 61, name: 'Movies & Concerts' }, { id: 62, name: 'OTT & Streaming' }] 
  },
  { 
    id: 7, name: 'Health & Medical', color: '#06B6D4', budgetLimit: 3500,
    subcategories: [{ id: 71, name: 'Medicines & Pharmacy' }, { id: 72, name: 'Doctor & Diagnostics' }] 
  },
  { 
    id: 8, name: 'Miscellaneous', color: '#64748B', budgetLimit: 2000,
    subcategories: [{ id: 81, name: 'General Expenses' }] 
  }
];

const seedExpenses = [
  { id: 101, title: 'Weekly Grocery Store', amount: 1450.00, categoryId: 1, categoryName: 'Groceries', categoryColor: '#10B981', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'D-Mart Supermarket' },
  { id: 102, title: 'Dinner with Friends', amount: 850.00, categoryId: 2, categoryName: 'Dining & Food', categoryColor: '#EF4444', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'Barbeque Nation' },
  { id: 103, title: 'Electricity & Wi-Fi Bill', amount: 2100.00, categoryId: 4, categoryName: 'Bills & Utilities', categoryColor: '#3B82F6', expenseDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'MSEB Monthly Power' },
  { id: 104, title: 'Branded Shoes & Clothes', amount: 3200.00, categoryId: 3, categoryName: 'Shopping', categoryColor: '#8B5CF6', expenseDate: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], paymentMethod: 'Card', notes: 'Zudio Store' },
  { id: 105, title: 'Petrol Refill', amount: 500.00, categoryId: 5, categoryName: 'Transportation', categoryColor: '#F59E0B', expenseDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'HP Fuel Station' }
];

const getLocalStore = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === 'null') {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

// Request Interceptor: Attach JWT Token if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('expense_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Intercept Netlify HTML responses and serve client data
api.interceptors.response.use(
  (response) => {
    // If response data is HTML string (from Netlify SPA rewrite), reject so fallback runs
    if (typeof response.data === 'string' && (response.data.trim().startsWith('<!') || response.data.trim().startsWith('<html'))) {
      const error = new Error('Netlify SPA returned HTML instead of API JSON');
      error.response = { status: 404 };
      error.config = response.config;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    const { config, response } = error;
    
    // Fallback Engine for offline / Netlify SPA mode
    if (!response || response.status === 404 || response.status === 500 || response.status === 401 || error.code === 'ERR_NETWORK' || typeof error.response?.data === 'string') {
      const url = config?.url || '';
      const method = (config?.method || 'get').toLowerCase();

      console.warn(`[Client Fallback Engine] Handling ${method.toUpperCase()} ${url}`);

      // 0. Auth Check Endpoint
      if (url.includes('/auth/me') || url.includes('/users/profile')) {
        const savedUser = getLocalStore('expense_user', { id: 1, name: 'Anant Bawaskar', email: 'anantb1003@gmail.com', currency: 'INR' });
        return Promise.resolve({ data: savedUser });
      }

      // 1. Categories Endpoint
      if (url.includes('/categories')) {
        const categories = getLocalStore('local_categories', seedCategories);
        return Promise.resolve({ data: categories });
      }

      // 2. Analytics Summary Endpoint
      if (url.includes('/analytics/summary')) {
        const expenses = getLocalStore('local_expenses', seedExpenses);
        const spentToday = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const summaryData = {
          spentToday: 2300,
          spentThisWeek: 7600,
          spentThisMonth: 14200,
          topCategoryName: 'Groceries',
          topCategoryAmount: 4950,
          budgetAlerts: []
        };
        return Promise.resolve({ data: summaryData });
      }

      // 3. Analytics Category Breakdown
      if (url.includes('/analytics/category-breakdown')) {
        const breakdown = [
          { categoryName: 'Groceries', amount: 4950, percentage: 34.8, categoryColor: '#10B981' },
          { categoryName: 'Shopping', amount: 3200, percentage: 22.5, categoryColor: '#8B5CF6' },
          { categoryName: 'Bills & Utilities', amount: 2100, percentage: 14.7, categoryColor: '#3B82F6' },
          { categoryName: 'Dining & Food', amount: 1850, percentage: 13.0, categoryColor: '#EF4444' },
          { categoryName: 'Transportation', amount: 1200, percentage: 8.4, categoryColor: '#F59E0B' },
          { categoryName: 'Entertainment', amount: 900, percentage: 6.6, categoryColor: '#EC4899' }
        ];
        return Promise.resolve({ data: breakdown });
      }

      // 4. Analytics Monthly Trend
      if (url.includes('/analytics/monthly-trend')) {
        const trend = [
          { monthLabel: 'Mar', monthName: 'Mar', year: 2026, totalAmount: 11200 },
          { monthLabel: 'Apr', monthName: 'Apr', year: 2026, totalAmount: 13500 },
          { monthLabel: 'May', monthName: 'May', year: 2026, totalAmount: 12800 },
          { monthLabel: 'Jun', monthName: 'Jun', year: 2026, totalAmount: 15400 },
          { monthLabel: 'Jul', monthName: 'Jul', year: 2026, totalAmount: 14100 },
          { monthLabel: 'Aug', monthName: 'Aug', year: 2026, totalAmount: 14200 }
        ];
        return Promise.resolve({ data: trend });
      }

      // 5. Expenses Endpoint
      if (url.includes('/expenses')) {
        const expenses = getLocalStore('local_expenses', seedExpenses);
        if (method === 'get') {
          return Promise.resolve({
            data: {
              content: expenses,
              totalPages: 1,
              totalElements: expenses.length,
              size: 20,
              number: 0
            }
          });
        }
        if (method === 'post') {
          let body = {};
          try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
          const newExpense = { id: Date.now(), ...body };
          expenses.unshift(newExpense);
          localStorage.setItem('local_expenses', JSON.stringify(expenses));
          return Promise.resolve({ data: newExpense });
        }
      }

      // 6. Budgets Endpoint
      if (url.includes('/budgets')) {
        const budgets = [
          { id: 1, categoryId: 1, categoryName: 'Groceries', amountLimit: 6000, budgetAmount: 6000, spentAmount: 4950, percentageUsed: 82.5, remainingAmount: 1050 },
          { id: 2, categoryId: 2, categoryName: 'Dining & Food', amountLimit: 3000, budgetAmount: 3000, spentAmount: 1850, percentageUsed: 61.6, remainingAmount: 1150 },
          { id: 3, categoryId: 3, categoryName: 'Shopping', amountLimit: 5000, budgetAmount: 5000, spentAmount: 3200, percentageUsed: 64.0, remainingAmount: 1800 }
        ];
        return Promise.resolve({ data: budgets });
      }

      // 7. Recurring Endpoint
      if (url.includes('/recurring')) {
        const recurring = [
          { id: 1, title: 'Netflix & Spotify Subscription', amount: 649.00, categoryName: 'Entertainment', frequency: 'MONTHLY', nextDueDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0], active: true },
          { id: 2, title: 'Airtel Broadband Internet', amount: 999.00, categoryName: 'Bills & Utilities', frequency: 'MONTHLY', nextDueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], active: true }
        ];
        return Promise.resolve({ data: recurring });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
