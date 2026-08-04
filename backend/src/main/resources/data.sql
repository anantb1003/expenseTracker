-- Seed Data Script for Default Categories & Demo Expenses (INR Currency)

-- Seed Demo User (email: demo@example.com / password: password123)
-- Let database identity auto-increment handle user ID (will be ID 1, next auto-increment sequence will be ID 2)
INSERT INTO users (name, email, password_hash, currency, created_at)
VALUES ('Demo User', 'demo@example.com', '$2a$10$j7mAY9a1e6JbtMqTBGfPee2IQ9BwGDwkFYaQeDI2ifLbPtatUxHLy', 'INR', CURRENT_TIMESTAMP);

-- Seed Default Predefined Categories
INSERT INTO categories (user_id, name, icon, color, is_default) VALUES
(NULL, 'Food & Dining', 'Utensils', '#EF4444', TRUE),
(NULL, 'Transport', 'Car', '#3B82F6', TRUE),
(NULL, 'Groceries', 'ShoppingBag', '#10B981', TRUE),
(NULL, 'Housing & Rent', 'Home', '#8B5CF6', TRUE),
(NULL, 'Utilities', 'Zap', '#F59E0B', TRUE),
(NULL, 'Entertainment', 'Film', '#EC4899', TRUE),
(NULL, 'Health & Fitness', 'Activity', '#06B6D4', TRUE),
(NULL, 'Shopping', 'Gift', '#6366F1', TRUE),
(NULL, 'Education', 'BookOpen', '#14B8A6', TRUE),
(NULL, 'Travel', 'Plane', '#F97316', TRUE),
(NULL, 'Subscriptions', 'Repeat', '#84CC16', TRUE),
(NULL, 'Miscellaneous', 'MoreHorizontal', '#64748B', TRUE);

-- Seed Default Subcategories (Referencing category IDs 1..12)
INSERT INTO subcategories (category_id, name) VALUES
(1, 'Restaurants'), (1, 'Coffee & Snacks'), (1, 'Fast Food'),
(2, 'Fuel'), (2, 'Public Transit'), (2, 'Taxi / Rideshare'),
(3, 'Supermarket'), (3, 'Organic Market'),
(4, 'Rent'), (4, 'Maintenance'),
(5, 'Electricity'), (5, 'Water'), (5, 'Internet & Wifi'),
(6, 'Movies & Theater'), (6, 'Gaming'), (6, 'Events'),
(7, 'Pharmacy'), (7, 'Doctor Visit'), (7, 'Gym Membership'),
(8, 'Clothing'), (8, 'Electronics'),
(11, 'Streaming Services'), (11, 'Software SaaS');

-- Seed Sample Expenses for Demo User (User ID 1)
INSERT INTO expenses (user_id, category_id, subcategory_id, amount, currency, expense_date, payment_method, notes, is_recurring, created_at) VALUES
(1, 1, 1, 850.00, 'INR', '2026-08-04', 'UPI', 'Dinner at Punjabi Rasoi', FALSE, CURRENT_TIMESTAMP),
(1, 2, 4, 1500.00, 'INR', '2026-08-03', 'UPI', 'Petrol refill at HP station', FALSE, CURRENT_TIMESTAMP),
(1, 3, 7, 3450.00, 'INR', '2026-08-02', 'CARD', 'Weekly DMart supermarket groceries', FALSE, CURRENT_TIMESTAMP),
(1, 5, 12, 1299.00, 'INR', '2026-07-28', 'UPI', 'Airtel Fiber Broadband bill', TRUE, CURRENT_TIMESTAMP),
(1, 6, 14, 649.00, 'INR', '2026-07-25', 'CARD', 'Netflix Premium HD plan', TRUE, CURRENT_TIMESTAMP),
(1, 1, 2, 220.00, 'INR', '2026-08-04', 'UPI', 'Cold coffee & cookies at Cafe', FALSE, CURRENT_TIMESTAMP);

-- Seed Sample Budget for Demo User (User ID 1)
INSERT INTO budgets (user_id, category_id, budget_month, budget_year, amount, created_at) VALUES
(1, 1, 8, 2026, 8000.00, CURRENT_TIMESTAMP),
(1, 2, 8, 2026, 5000.00, CURRENT_TIMESTAMP),
(1, 3, 8, 2026, 12000.00, CURRENT_TIMESTAMP),
(1, NULL, 8, 2026, 45000.00, CURRENT_TIMESTAMP);
