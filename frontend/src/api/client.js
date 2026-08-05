import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initial Seed Data with Gym & Workout Diet Categories and Icons
const seedCategories = [
  { 
    id: 1, name: '💪 Gym & Fitness Diet', color: '#F97316', budgetLimit: 5000,
    subcategories: [
      { id: 10, name: '🏋️ Gym Membership & Trainer' },
      { id: 11, name: '🥛 Whey Protein & Supplements' },
      { id: 12, name: '🥗 Fitness Diet & Meal Prep' },
      { id: 13, name: '👟 Workout Gear & Activewear' }
    ] 
  },
  { 
    id: 2, name: '🛒 Groceries & Supermarket', color: '#10B981', budgetLimit: 6000,
    subcategories: [
      { id: 20, name: '🏪 Supermarket & D-Mart' },
      { id: 21, name: '🍎 Fruits & Fresh Vegetables' },
      { id: 22, name: '🥛 Dairy, Milk & Bakery' }
    ] 
  },
  { 
    id: 3, name: '🍔 Dining & Restaurants', color: '#EF4444', budgetLimit: 3500,
    subcategories: [
      { id: 30, name: '🍕 Restaurants & Fast Food' },
      { id: 31, name: '🛵 Zomato & Swiggy Delivery' },
      { id: 32, name: '☕ Coffee & Evening Tea' }
    ] 
  },
  { 
    id: 4, name: '🛍️ Shopping & Apparel', color: '#8B5CF6', budgetLimit: 5000,
    subcategories: [
      { id: 40, name: '👕 Clothes, Shoes & Fashion' },
      { id: 41, name: '📱 Electronics & Gadgets' },
      { id: 42, name: '🏠 Home Accessories' }
    ] 
  },
  { 
    id: 5, name: '💡 Bills & Utilities', color: '#3B82F6', budgetLimit: 4000,
    subcategories: [
      { id: 50, name: '⚡ Electricity & Gas Bill' },
      { id: 51, name: '📶 Mobile Recharge & Wi-Fi' },
      { id: 52, name: '💧 Water & Society Maintenance' }
    ] 
  },
  { 
    id: 6, name: '⛽ Fuel & Transportation', color: '#F59E0B', budgetLimit: 3000,
    subcategories: [
      { id: 60, name: '⛽ Petrol & Diesel Refill' },
      { id: 61, name: '🚖 Uber / Ola & Cab' },
      { id: 62, name: '🛣️ Toll, Fastag & Bus' }
    ] 
  },
  { 
    id: 7, name: '🎬 Entertainment & OTT', color: '#EC4899', budgetLimit: 2500,
    subcategories: [
      { id: 70, name: '🎟️ Cinema & Movie Tickets' },
      { id: 71, name: '🍿 Netflix, Prime & Spotify' }
    ] 
  },
  { 
    id: 8, name: '🩺 Medical & Health', color: '#06B6D4', budgetLimit: 3500,
    subcategories: [
      { id: 80, name: '💊 Medicines & Medical Store' },
      { id: 81, name: '🩺 Doctor & Diagnostic Tests' }
    ] 
  }
];

const seedExpenses = [
  { id: 100, title: 'Gold Gym Monthly Membership', amount: 2500.00, categoryId: 1, categoryName: '💪 Gym & Fitness Diet', categoryColor: '#F97316', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'Monthly Fitness & Gym Subscription' },
  { id: 101, title: 'Optimum Nutrition Whey Protein', amount: 4800.00, categoryId: 1, categoryName: '💪 Gym & Fitness Diet', categoryColor: '#F97316', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', notes: '2kg Whey Protein Isolate & Creatine' },
  { id: 102, title: 'Weekly Grocery Supermarket', amount: 1450.00, categoryId: 2, categoryName: '🛒 Groceries & Supermarket', categoryColor: '#10B981', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'D-Mart Supermarket Fresh Vegetables' },
  { id: 103, title: 'Dinner with Friends', amount: 850.00, categoryId: 3, categoryName: '🍔 Dining & Restaurants', categoryColor: '#EF4444', expenseDate: new Date().toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'Barbeque Nation Buffet' },
  { id: 104, title: 'Electricity & Wi-Fi Bill', amount: 2100.00, categoryId: 5, categoryName: '💡 Bills & Utilities', categoryColor: '#3B82F6', expenseDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], paymentMethod: 'UPI', notes: 'MSEB Monthly Power & Airtel Wi-Fi' }
];

const seedHistoryLogs = [
  {
    id: 1,
    actionType: 'CREATE',
    expenseId: 100,
    details: 'Logged ₹2,500.00 for 💪 Gym & Fitness Diet (Gold Gym Membership)',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    actionType: 'CREATE',
    expenseId: 101,
    details: 'Logged ₹4,800.00 for 💪 Gym & Fitness Diet (Whey Protein & Creatine)',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

const seedBudgets = [
  { id: 1, categoryId: 1, categoryName: '💪 Gym & Fitness Diet', amountLimit: 8000, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
  { id: 2, categoryId: 2, categoryName: '🛒 Groceries & Supermarket', amountLimit: 6000, month: new Date().getMonth() + 1, year: new Date().getFullYear() }
];

const seedRecurring = [
  { id: 1, title: 'Gold Gym Monthly Subscription', amount: 2500.00, categoryId: 1, categoryName: '💪 Gym & Fitness Diet', frequency: 'MONTHLY', nextDueDate: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0], paymentMethod: 'UPI', active: true },
  { id: 2, title: 'Airtel Broadband Wi-Fi', amount: 999.00, categoryId: 5, categoryName: '💡 Bills & Utilities', frequency: 'MONTHLY', nextDueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], paymentMethod: 'UPI', active: true }
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

// Fallback Engine Handler with Complete Dynamic Metric, Search & Filtering
const handleFallbackResponse = (config) => {
  const url = config?.url || '';
  const method = (config?.method || 'get').toLowerCase();

  console.log(`[Client Engine Active] Handling ${method.toUpperCase()} ${url}`);

  // 0. Auth Endpoints
  if (url.includes('/auth/login')) {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
    const email = body.email || 'anantb1003@gmail.com';
    const nameFromEmail = email.split('@')[0].replace('.', ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const userProfile = {
      id: Date.now(),
      name: formattedName || 'Anant Bawaskar',
      email: email,
      currency: 'INR'
    };
    const accessToken = 'jwt-token-auth-' + Date.now();

    localStorage.setItem('expense_jwt_token', accessToken);
    localStorage.setItem('expense_user', JSON.stringify(userProfile));

    return Promise.resolve({
      data: {
        accessToken,
        tokenType: 'Bearer',
        user: userProfile
      },
      status: 200,
      headers: {},
      config
    });
  }

  if (url.includes('/auth/register')) {
    let body = {};
    try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
    const userProfile = {
      id: Date.now(),
      name: body.name || 'Anant Bawaskar',
      email: body.email || 'anantb1003@gmail.com',
      currency: 'INR'
    };
    const accessToken = 'jwt-token-auth-' + Date.now();

    localStorage.setItem('expense_jwt_token', accessToken);
    localStorage.setItem('expense_user', JSON.stringify(userProfile));

    return Promise.resolve({
      data: {
        accessToken,
        tokenType: 'Bearer',
        user: userProfile
      },
      status: 200,
      headers: {},
      config
    });
  }

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
      const newCat = { id: Date.now(), subcategories: [], ...body };
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

  // 2. Analytics Summary Endpoint
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

    // Budget Alerts
    const rawBudgets = getLocalStore('local_budgets', seedBudgets);
    const budgetAlerts = [];

    rawBudgets.forEach(b => {
      const catExpenses = expenses.filter(e => String(e.categoryId) === String(b.categoryId) && e.expenseDate && e.expenseDate.startsWith(currentYearMonth));
      const spent = catExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const pct = b.amountLimit > 0 ? (spent / b.amountLimit) * 100 : 0;
      if (pct >= 80) {
        budgetAlerts.push({
          categoryId: b.categoryId,
          categoryName: b.categoryName || 'Category',
          budgetAmount: b.amountLimit,
          spentAmount: spent,
          percentageUsed: pct,
          exceeded: spent > b.amountLimit
        });
      }
    });

    const summaryData = {
      spentToday,
      spentThisWeek,
      spentThisMonth,
      topCategoryName,
      topCategoryAmount,
      budgetAlerts
    };
    return Promise.resolve({ data: summaryData, status: 200, headers: {}, config });
  }

  // 3. Analytics Category Breakdown
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

  // 4. Analytics Monthly Trend
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

  // 4.5. Analytics Daily Trend
  if (url.includes('/analytics/daily-trend')) {
    const expenses = getLocalStore('local_expenses', seedExpenses);
    const dailyMap = {};
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
      dailyMap[dateStr] = { date: dayLabel, dateStr, totalAmount: 0 };
    }

    expenses.forEach(e => {
      if (e.expenseDate && dailyMap[e.expenseDate]) {
        dailyMap[e.expenseDate].totalAmount += Number(e.amount || 0);
      }
    });

    const dailyTrend = Object.values(dailyMap);
    return Promise.resolve({ data: dailyTrend, status: 200, headers: {}, config });
  }

  // 5. Activity History Endpoint
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

  // 7. General Expenses Endpoint WITH REAL-TIME SEARCH & FILTERING!
  if (url.includes('/expenses')) {
    let expenses = getLocalStore('local_expenses', seedExpenses);

    if (method === 'get') {
      const params = config?.params || {};
      const searchKeyword = (params.search || params.searchKeyword || '').toLowerCase().trim();
      const catId = params.categoryId ? String(params.categoryId) : '';
      const startDate = params.startDate || '';
      const endDate = params.endDate || '';
      const paymentMethod = params.paymentMethod || '';

      if (searchKeyword) {
        expenses = expenses.filter(e => 
          (e.title && e.title.toLowerCase().includes(searchKeyword)) ||
          (e.notes && e.notes.toLowerCase().includes(searchKeyword)) ||
          (e.categoryName && e.categoryName.toLowerCase().includes(searchKeyword)) ||
          (e.paymentMethod && e.paymentMethod.toLowerCase().includes(searchKeyword))
        );
      }

      if (catId) {
        expenses = expenses.filter(e => String(e.categoryId) === catId);
      }

      if (startDate) {
        expenses = expenses.filter(e => e.expenseDate && e.expenseDate >= startDate);
      }

      if (endDate) {
        expenses = expenses.filter(e => e.expenseDate && e.expenseDate <= endDate);
      }

      if (paymentMethod) {
        expenses = expenses.filter(e => e.paymentMethod === paymentMethod);
      }

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
      pushAuditLog('CREATE', newExpense.id, `Logged ₹${Number(newExpense.amount).toLocaleString('en-IN')} for ${newExpense.categoryName || 'Expense'} (${newExpense.notes || newExpense.title || 'Expense'})`);
      return Promise.resolve({ data: newExpense, status: 200, headers: {}, config });
    }

    if (method === 'put') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const idStr = url.split('/').pop();
      const updatedExpenses = expenses.map(e => String(e.id) === idStr ? { ...e, ...body } : e);
      localStorage.setItem('local_expenses', JSON.stringify(updatedExpenses));
      pushAuditLog('UPDATE', Number(idStr), `Updated expense record #${idStr} (${body.notes || body.title || 'Expense'})`);
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
    const rawBudgets = getLocalStore('local_budgets', seedBudgets);
    const expenses = getLocalStore('local_expenses', seedExpenses);
    const categories = getLocalStore('local_categories', seedCategories);

    if (method === 'get') {
      const currentYearMonth = new Date().toISOString().substring(0, 7);

      const calculatedBudgets = rawBudgets.map(b => {
        const catObj = categories.find(c => String(c.id) === String(b.categoryId));
        const catExpenses = expenses.filter(e => String(e.categoryId) === String(b.categoryId) && e.expenseDate && e.expenseDate.startsWith(currentYearMonth));
        const spentAmount = catExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
        const limit = Number(b.amountLimit || b.budgetAmount || 5000);
        const percentageUsed = limit > 0 ? (spentAmount / limit) * 100 : 0;
        const remainingAmount = limit - spentAmount;

        return {
          id: b.id,
          categoryId: b.categoryId,
          categoryName: b.categoryName || catObj?.name || 'Category',
          categoryColor: catObj?.color || '#4F46E5',
          amountLimit: limit,
          budgetAmount: limit,
          spentAmount,
          percentageUsed: Number(percentageUsed.toFixed(1)),
          remainingAmount
        };
      });

      return Promise.resolve({ data: calculatedBudgets, status: 200, headers: {}, config });
    }

    if (method === 'post' || method === 'put') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const catObj = categories.find(c => String(c.id) === String(body.categoryId));
      const newBudget = {
        id: Date.now(),
        categoryId: body.categoryId,
        categoryName: catObj?.name || 'Category',
        amountLimit: Number(body.amount || 5000),
        month: body.month || new Date().getMonth() + 1,
        year: body.year || new Date().getFullYear()
      };
      rawBudgets.push(newBudget);
      localStorage.setItem('local_budgets', JSON.stringify(rawBudgets));
      return Promise.resolve({ data: newBudget, status: 200, headers: {}, config });
    }

    if (method === 'delete') {
      const idStr = url.split('/').pop();
      const filtered = rawBudgets.filter(b => String(b.id) !== idStr);
      localStorage.setItem('local_budgets', JSON.stringify(filtered));
      return Promise.resolve({ data: { message: 'Budget limit removed' }, status: 200, headers: {}, config });
    }
  }

  // 9. Recurring Endpoint
  if (url.includes('/recurring')) {
    const recurringList = getLocalStore('local_recurring', seedRecurring);

    if (url.includes('/trigger')) {
      const parts = url.split('/');
      const idStr = parts[parts.indexOf('recurring') + 1];
      const targetRule = recurringList.find(r => String(r.id) === idStr);

      if (targetRule) {
        const expenses = getLocalStore('local_expenses', seedExpenses);
        const newExpense = {
          id: Date.now(),
          title: targetRule.title || 'Recurring Payment',
          amount: targetRule.amount,
          categoryId: targetRule.categoryId || 1,
          categoryName: targetRule.categoryName || 'General',
          categoryColor: '#4F46E5',
          expenseDate: new Date().toISOString().split('T')[0],
          paymentMethod: targetRule.paymentMethod || 'UPI',
          notes: `Auto-triggered recurring payment: ${targetRule.title}`
        };
        expenses.unshift(newExpense);
        localStorage.setItem('local_expenses', JSON.stringify(expenses));
        pushAuditLog('CREATE', newExpense.id, `Triggered recurring ₹${Number(newExpense.amount).toLocaleString('en-IN')} payment: ${targetRule.title}`);

        const nextDate = new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);
        targetRule.nextDueDate = nextDate.toISOString().split('T')[0];
        localStorage.setItem('local_recurring', JSON.stringify(recurringList));
      }
      return Promise.resolve({ data: { message: 'Recurring transaction executed successfully' }, status: 200, headers: {}, config });
    }

    if (method === 'get') {
      return Promise.resolve({ data: recurringList, status: 200, headers: {}, config });
    }

    if (method === 'post') {
      let body = {};
      try { body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {}); } catch(e) {}
      const categories = getLocalStore('local_categories', seedCategories);
      const catObj = categories.find(c => String(c.id) === String(body.categoryId));

      const newRule = {
        id: Date.now(),
        title: body.title || `${catObj?.name || 'Category'} Subscription`,
        amount: Number(body.amount),
        categoryId: body.categoryId,
        categoryName: catObj?.name || 'General',
        frequency: body.frequency || 'MONTHLY',
        nextDueDate: body.nextDueDate || new Date().toISOString().split('T')[0],
        paymentMethod: body.paymentMethod || 'UPI',
        active: true
      };
      recurringList.push(newRule);
      localStorage.setItem('local_recurring', JSON.stringify(recurringList));
      return Promise.resolve({ data: newRule, status: 200, headers: {}, config });
    }

    if (method === 'delete') {
      const idStr = url.split('/').pop();
      const filtered = recurringList.filter(r => String(r.id) !== idStr);
      localStorage.setItem('local_recurring', JSON.stringify(filtered));
      return Promise.resolve({ data: { message: 'Schedule removed' }, status: 200, headers: {}, config });
    }
  }

  // 10. Export Endpoints
  if (url.includes('/export/')) {
    const expenses = getLocalStore('local_expenses', seedExpenses);

    let csvContent = 'ID,Date,Title,Category,Amount,Payment Method,Notes\n';
    expenses.forEach(e => {
      csvContent += `${e.id},${e.expenseDate},"${e.title || 'Expense'}","${e.categoryName || ''}",${e.amount},${e.paymentMethod || 'UPI'},"${e.notes || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return Promise.resolve({ data: blob, status: 200, headers: {}, config });
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
