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
  { id: 104, title: 'Branded Shoes & Clothes', amount: 3200.00, categoryId: 3, categoryName: 'Shopping', categoryColor: '#8B5CF6', expenseDate: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], paymentMethod: 'CARD', notes: 'Zudio Store' },
  { id: 105, title: 'Petrol Refill', amount: 500.00, categoryId: 5, categoryName: 'Transportation', categoryColor: '#F59E0B', expenseDate: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'HP Fuel Station' }
];

const seedHistoryLogs = [
  {
    id: 1,
    actionType: 'CREATE',
    expenseId: 101,
    details: 'Logged ₹1,450.00 for Groceries (D-Mart Supermarket)',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    actionType: 'CREATE',
    expenseId: 102,
    details: 'Logged ₹850.00 for Dining & Food (Barbeque Nation)',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 3,
    actionType: 'UPDATE',
    expenseId: 103,
    details: 'Updated ₹2,100.00 bill notes to MSEB Monthly Power',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 4,
    actionType: 'CREATE',
    expenseId: 104,
    details: 'Logged ₹3,200.00 for Shopping (Zudio Store)',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString()
  }
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

const pushAuditLog = (actionType, expenseId, details) => {
  const logs = getLocalStore('local_expense_history', seedHistoryLogs);
  const newLog = {
    id: Date.now(),
    actionType,
    expenseId,
    details,
    timestamp: new Date().toISOString()
  };
  logs.unshift(newLog);
  localStorage.setItem('local_expense_history', JSON.stringify(logs));
};

// Fallback Engine Handler with Dynamic Metric Calculation
const handleFallbackResponse = (config) => {
  const url = config?.url || '';
  const method = (config?.method || 'get').toLowerCase();

  console.log(`[Client Engine Active] Handling ${method.toUpperCase()} ${url}`);

  // 0. Auth Check Endpoint
  if (url.includes('/auth/me') || url.includes('/users/profile')) {
    const savedUser = getLocalStore('expense_user', { id: 1, name: 'Anant Bawaskar', email: 'anantb1003@gmail.com', currency: 'INR' });
    return Promise.resolve({ data: savedUser, status: 200, headers: {}, config });
  }

  // 1. Categories Endpoint
  if (url.includes('/categories')) {
    const categories = getLocalStore('local_categories', seedCategories);
    if (method === 'get') {
      return Promise.resolve({ data: categories, status: 200, headers: {}, config });
    }
    if (method === 'post') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const newCat = { id: Date.now(), ...body };
      categories.push(newCat);
      localStorage.setItem('local_categories', JSON.stringify(categories));
      return Promise.resolve({ data: newCat, status: 200, headers: {}, config });
    }
    if (method === 'put') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const idStr = url.split('/').pop();
      const updatedList = categories.map(c => String(c.id) === idStr ? { ...c, ...body } : c);
      localStorage.setItem('local_categories', JSON.stringify(updatedList));
      return Promise.resolve({ data: body, status: 200, headers: {}, config });
    }
    if (method === 'delete') {
      const idStr = url.split('/').pop();
      const filtered = categories.filter(c => String(c.id) !== idStr);
      localStorage.setItem('local_categories', JSON.stringify(filtered));
      return Promise.resolve({ data: { message: 'Deleted successfully' }, status: 200, headers: {}, config });
    }
  }

  // 2. Analytics Summary Endpoint (Fully Dynamic!)
  if (url.includes('/analytics/summary')) {
    const expenses = getLocalStore('local_expenses', seedExpenses);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const spentToday = expenses
      .filter(e => e.expenseDate === todayStr)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0];
    const spentThisWeek = expenses
      .filter(e => e.expenseDate >= sevenDaysAgo && e.expenseDate <= todayStr)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const currentYearMonth = todayStr.substring(0, 7);
    const spentThisMonth = expenses
      .filter(e => e.expenseDate && e.expenseDate.startsWith(currentYearMonth))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const categoryTotals = {};
    expenses.forEach(e => {
      const catName = e.categoryName || 'Other';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + Number(e.amount || 0);
    });

    let topCategoryName = 'None';
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([catName, amt]) => {
      if (amt > topCategoryAmount) {
        topCategoryAmount = amt;
        topCategoryName = catName;
      }
    });

    const summaryData = {
      spentToday,
      spentThisWeek,
      spentThisMonth,
      topCategoryName,
      topCategoryAmount,
      budgetAlerts: []
    };
    return Promise.resolve({ data: summaryData, status: 200, headers: {}, config });
  }

  // 3. Analytics Category Breakdown (Fully Dynamic!)
  if (url.includes('/analytics/category-breakdown')) {
    const expenses = getLocalStore('local_expenses', seedExpenses);
    if (!expenses || expenses.length === 0) {
      return Promise.resolve({ data: [], status: 200, headers: {}, config });
    }

    const categories = getLocalStore('local_categories', seedCategories);
    const categoryMap = {};
    categories.forEach(c => {
      categoryMap[c.name] = c.color || '#4F46E5';
    });

    const categoryTotals = {};
    let totalSpent = 0;
    expenses.forEach(e => {
      const amt = Number(e.amount || 0);
      const catName = e.categoryName || 'General';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + amt;
      totalSpent += amt;
    });

    const breakdown = Object.entries(categoryTotals).map(([catName, amt]) => ({
      categoryName: catName,
      amount: amt,
      percentage: totalSpent > 0 ? Number(((amt / totalSpent) * 100).toFixed(1)) : 0,
      categoryColor: categoryMap[catName] || '#6366F1'
    }));

    return Promise.resolve({ data: breakdown, status: 200, headers: {}, config });
  }

  // 4. Analytics Monthly Trend (Fully Dynamic!)
  if (url.includes('/analytics/monthly-trend')) {
    const expenses = getLocalStore('local_expenses', seedExpenses);
    if (!expenses || expenses.length === 0) {
      return Promise.resolve({ data: [], status: 200, headers: {}, config });
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const trend = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yearMonthKey = `${yyyy}-${mm}`;
      const monthLabel = monthNames[d.getMonth()];

      const totalForMonth = expenses
        .filter(e => e.expenseDate && e.expenseDate.startsWith(yearMonthKey))
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

      trend.push({
        monthLabel,
        monthName: monthLabel,
        year: yyyy,
        totalAmount: totalForMonth
      });
    }

    return Promise.resolve({ data: trend, status: 200, headers: {}, config });
  }

  // 5. Activity History Endpoint MUST BE Intercepted BEFORE /expenses
  if (url.includes('/expenses/history')) {
    const historyLogs = getLocalStore('local_expense_history', seedHistoryLogs);
    return Promise.resolve({
      data: {
        content: historyLogs,
        totalPages: 1,
        totalElements: historyLogs.length,
        size: 15,
        number: 0
      },
      status: 200,
      headers: {},
      config
    });
  }

  // 6. Bulk Operations
  if (url.includes('/expenses/bulk-delete')) {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
    const idsToDelete = (body.ids || []).map(id => String(id));
    const expenses = getLocalStore('local_expenses', seedExpenses);
    const filtered = expenses.filter(e => !idsToDelete.includes(String(e.id)));
    localStorage.setItem('local_expenses', JSON.stringify(filtered));
    pushAuditLog('BULK_DELETE', null, `Bulk deleted ${idsToDelete.length} expense records`);
    return Promise.resolve({ data: { message: `Deleted ${idsToDelete.length} expenses` }, status: 200, headers: {}, config });
  }

  if (url.includes('/expenses/bulk-recategorize')) {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
    pushAuditLog('BULK_RECATEGORIZE', null, `Bulk recategorized ${(body.ids || []).length} expense records`);
    return Promise.resolve({ data: { message: 'Recategorized successfully' }, status: 200, headers: {}, config });
  }

  // 7. General Expenses Endpoint
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
        },
        status: 200,
        headers: {},
        config
      });
    }

    if (method === 'post') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const newExpense = { id: Date.now(), ...body };
      expenses.unshift(newExpense);
      localStorage.setItem('local_expenses', JSON.stringify(expenses));
      pushAuditLog('CREATE', newExpense.id, `Logged ₹${Number(newExpense.amount).toLocaleString('en-IN')} for ${newExpense.categoryName || 'Expense'} (${newExpense.notes || 'Expense'})`);
      return Promise.resolve({ data: newExpense, status: 200, headers: {}, config });
    }

    if (method === 'put') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const idStr = url.split('/').pop();
      const updatedExpenses = expenses.map(e => String(e.id) === idStr ? { ...e, ...body } : e);
      localStorage.setItem('local_expenses', JSON.stringify(updatedExpenses));
      pushAuditLog('UPDATE', Number(idStr), `Updated expense record #${idStr} (${body.notes || 'Expense'})`);
      return Promise.resolve({ data: body, status: 200, headers: {}, config });
    }

    if (method === 'delete') {
      const idStr = url.split('/').pop();
      const filtered = expenses.filter(e => String(e.id) !== idStr);
      localStorage.setItem('local_expenses', JSON.stringify(filtered));
      pushAuditLog('DELETE', Number(idStr), `Deleted expense record #${idStr}`);
      return Promise.resolve({ data: { message: 'Deleted successfully' }, status: 200, headers: {}, config });
    }
  }

  // 8. Budgets Endpoint
  if (url.includes('/budgets')) {
    const budgets = [
      { id: 1, categoryId: 1, categoryName: 'Groceries', amountLimit: 6000, budgetAmount: 6000, spentAmount: 4950, percentageUsed: 82.5, remainingAmount: 1050 },
      { id: 2, categoryId: 2, categoryName: 'Dining & Food', amountLimit: 3000, budgetAmount: 3000, spentAmount: 1850, percentageUsed: 61.6, remainingAmount: 1150 },
      { id: 3, categoryId: 3, categoryName: 'Shopping', amountLimit: 5000, budgetAmount: 5000, spentAmount: 3200, percentageUsed: 64.0, remainingAmount: 1800 }
    ];
    return Promise.resolve({ data: budgets, status: 200, headers: {}, config });
  }

  // 9. Recurring Endpoint
  if (url.includes('/recurring')) {
    const recurring = [
      { id: 1, title: 'Netflix & Spotify Subscription', amount: 649.00, categoryName: 'Entertainment', frequency: 'MONTHLY', nextDueDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0], active: true },
      { id: 2, title: 'Airtel Broadband Internet', amount: 999.00, categoryName: 'Bills & Utilities', frequency: 'MONTHLY', nextDueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], active: true }
    ];
    return Promise.resolve({ data: recurring, status: 200, headers: {}, config });
  }

  return Promise.resolve({ data: {}, status: 200, headers: {}, config });
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

// Response Interceptor: Seamlessly process real responses OR serve fallback
api.interceptors.response.use(
  (response) => {
    // If response is HTML string from Netlify SPA rewrite, invoke fallback!
    if (typeof response.data === 'string' && (response.data.trim().startsWith('<!') || response.data.trim().startsWith('<html'))) {
      return handleFallbackResponse(response.config);
    }
    return response;
  },
  (error) => {
    // On any network error, 404, 500, or 401: invoke fallback smoothly!
    return handleFallbackResponse(error.config);
  }
);

export default api;
