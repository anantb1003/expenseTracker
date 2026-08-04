-- PostgreSQL Schema & Database Initialization Script for Daily Expense Management

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Tag',
    color VARCHAR(20) DEFAULT '#4F46E5',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subcategories Table
CREATE TABLE IF NOT EXISTS subcategories (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- 4. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI',
    notes TEXT,
    receipt_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    budget_month INT NOT NULL,
    budget_year INT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_category_month_year UNIQUE (user_id, category_id, budget_month, budget_year)
);

-- 6. Recurring Expenses Table
CREATE TABLE IF NOT EXISTS recurring_expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    frequency VARCHAR(20) NOT NULL,
    next_due_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Expense Audit Logs Table
CREATE TABLE IF NOT EXISTS expense_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_id BIGINT,
    action_type VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, BULK_DELETE, BULK_RECATEGORIZE, IMPORT
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Required Indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON expense_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON expense_audit_logs(timestamp);

-- PostgreSQL Stored Procedure for Monthly Category-Wise Aggregation
CREATE OR REPLACE FUNCTION get_monthly_category_aggregation(
    p_user_id BIGINT,
    p_year INT,
    p_month INT
)
RETURNS TABLE (
    category_id BIGINT,
    category_name VARCHAR(100),
    category_color VARCHAR(20),
    category_icon VARCHAR(50),
    total_amount NUMERIC(12, 2),
    expense_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.color AS category_color,
        c.icon AS category_icon,
        COALESCE(SUM(e.amount), 0.00) AS total_amount,
        COUNT(e.id) AS expense_count
    FROM categories c
    JOIN expenses e ON c.id = e.category_id
    WHERE e.user_id = p_user_id
      AND EXTRACT(YEAR FROM e.expense_date) = p_year
      AND EXTRACT(MONTH FROM e.expense_date) = p_month
    GROUP BY c.id, c.name, c.color, c.icon
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;
