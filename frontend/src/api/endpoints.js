import api from './client';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  googleLogin: (googleData) => api.post('/auth/google', googleData),
  getCurrentUser: () => api.get('/auth/me'),
  getProfile: () => api.get('/auth/me'),
};

export const userApi = {
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
};

export const expenseApi = {
  getExpenses: (params) => api.get('/expenses', { params }),
  getExpenseById: (id) => api.get(`/expenses/${id}`),
  createExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
  bulkDelete: (ids) => api.post('/expenses/bulk-delete', { ids }),
  bulkRecategorize: (ids, newCategoryId) => api.post('/expenses/bulk-recategorize', { ids, newCategoryId }),
  importCsv: (formData) => api.post('/expenses/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getHistory: (page = 0, size = 20) => api.get('/expenses/history', { params: { page, size } }),
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const budgetApi = {
  getBudgets: (month, year) => api.get('/budgets', { params: { month, year } }),
  setBudget: (data) => api.post('/budgets', data),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
  getThresholdAlerts: (month, year) => api.get('/budgets/alerts', { params: { month, year } }),
};

export const recurringApi = {
  getRecurring: () => api.get('/recurring'),
  createRecurring: (data) => api.post('/recurring', data),
  updateRecurring: (id, data) => api.put(`/recurring/${id}`, data),
  deleteRecurring: (id) => api.delete(`/recurring/${id}`),
  triggerProcess: () => api.post('/recurring/process'),
};

export const analyticsApi = {
  getSummary: () => api.get('/analytics/summary'),
  getCategoryBreakdown: (startDate, endDate) => api.get('/analytics/category-breakdown', { params: { startDate, endDate } }),
  getMonthlyTrend: (months = 6) => api.get('/analytics/monthly-trend', { params: { months } }),
  getDailyTrend: (year, month) => api.get('/analytics/daily-trend', { params: { year, month } }),
  getMonthlyAggregation: (year, month) => api.get('/analytics/monthly-aggregation', { params: { year, month } }),
};

export const exportApi = {
  exportCsv: (startDate, endDate) => api.get('/export/csv', { params: { startDate, endDate }, responseType: 'blob' }),
  exportExcel: (startDate, endDate) => api.get('/export/excel', { params: { startDate, endDate }, responseType: 'blob' }),
  exportPdf: (startDate, endDate) => api.get('/export/pdf', { params: { startDate, endDate }, responseType: 'blob' }),
};

// Aliases for compatibility
export const authEndpoints = authApi;
export const expenseEndpoints = expenseApi;
export const categoryEndpoints = categoryApi;
export const budgetEndpoints = budgetApi;
export const recurringEndpoints = recurringApi;
export const analyticsEndpoints = analyticsApi;
export const exportEndpoints = exportApi;
