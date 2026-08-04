# Daily Expense Management Web Application (ExpenseFlow)

A production-ready, full-stack **Daily Expense Management & Budget Analytics Web Application** built with Spring Boot 3, Java 21, React 18 (Vite), Tailwind CSS, PostgreSQL, and Recharts.

---

## Features Built

### 1. Authentication & Multi-Tenancy
- **JWT Session Security:** Stateless SecurityFilter with BCrypt password hashing.
- **Tenant Data Isolation:** Multi-tenant architecture isolated per `user_id`.
- **Demo Account Ready:** Pre-seeded account (`demo@example.com` / `password123`).

### 2. Expense CRUD & Bulk Management
- **Transaction Entry:** Log expenses with Category, Subcategory, Amount, Payment Method (Cash, Card, UPI, Wallet, Bank Transfer), Notes, Date, and optional Receipt URL.
- **Pagination & Advanced Search:** Filter by Custom Date Range, Category, Amount Range, Payment Method, and Keyword Notes.
- **Bulk Operations:** Mass delete and bulk re-categorization of selected records.
- **CSV Drag-and-Drop Import:** Bulk upload transactions from standard CSV files.

### 3. Categorization System
- **12 Default Categories:** Food & Dining, Transport, Groceries, Housing & Rent, Utilities, Entertainment, Health & Fitness, Shopping, Education, Travel, Subscriptions, Miscellaneous.
- **Custom User Categories:** Create, edit, and delete custom categories with custom color pickers and subcategories.

### 4. Budgeting Engine & Real-Time Alerts
- **Category & Monthly Targets:** Set specific category spending limits or overall monthly budget limits.
- **Visual Progress Bars:** Dynamic progress indicators showing spent vs limit with percentage completion.
- **Alert Banners:** Automatic in-app alert banners when spending crosses **80% (Warning)** and **100% (Critical Over-Budget)**.

### 5. Recurring Expenses Scheduler
- **Rule Scheduling:** Schedule daily, weekly, monthly, or yearly recurring costs (rent, subscriptions, utilities).
- **Auto-Processing & Manual Trigger:** Automatic `@Scheduled` background worker plus manual *"Log Entry Now"* trigger.

### 6. Interactive Analytics & Recharts Data Visualization
- **Category Spend Breakdown:** Interactive Pie Chart with percentages and custom tooltips.
- **Month-over-Month Trend:** 6 to 12-month spend comparison Bar Chart.
- **Daily Spend Fluctuation:** Day-by-day expenditure Line Chart.

### 7. Export & Financial Reports
- **Multi-Format Export:** Download expense summaries in **CSV**, **Excel (`.xlsx`)**, and **PDF Summary Report** formats.

### 8. Multi-Currency & Settings
- **Live Currency Switcher:** Convert transaction display between **USD ($)**, **EUR (€)**, **GBP (£)**, **INR (₹)**, **CAD (CA$)**, **AUD (A$)**, **JPY (¥)**.
- **Dark / Light Mode:** Dynamic glassmorphism design with light and dark mode toggling.

---

## Database Architecture & Stored Procedure

### Schema (`schema.sql`)
- `users`: `id`, `name`, `email`, `password_hash`, `currency`, `created_at`
- `categories`: `id`, `user_id`, `name`, `icon`, `color`, `is_default`, `created_at`
- `subcategories`: `id`, `category_id`, `name`
- `expenses`: `id`, `user_id`, `category_id`, `subcategory_id`, `amount`, `currency`, `expense_date`, `payment_method`, `notes`, `receipt_url`, `is_recurring`, `recurrence_rule`, `created_at`
- `budgets`: `id`, `user_id`, `category_id`, `month`, `year`, `amount`, `created_at`
- `recurring_expenses`: `id`, `user_id`, `category_id`, `subcategory_id`, `amount`, `currency`, `frequency`, `next_due_date`, `payment_method`, `notes`, `is_active`, `created_at`

### PostgreSQL Indexing
```sql
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
```

### PostgreSQL Monthly Aggregation Stored Procedure
```sql
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
```

---

## Quick Start Guide

### Method A: Standalone Local Run (Zero External Dependencies)

#### 1. Start Backend (Spring Boot with embedded H2 DB)
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run
# Linux/macOS:
./mvnw spring-boot:run
```
- Backend starts at: `http://localhost:8080`
- H2 Database Console available at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:expensedb`)

#### 2. Start Frontend (React Vite)
```bash
cd frontend
npm install
npm run dev
```
- Frontend starts at: `http://localhost:3000`

---

### Method B: Run via Docker Compose (PostgreSQL + Backend + Frontend)

```bash
docker-compose up --build
```
- Web Application UI: `http://localhost`
- Backend API: `http://localhost:8080`
- PostgreSQL Database: `localhost:5432`

---

## API Endpoints Reference (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user & get JWT token |
| `POST` | `/api/v1/auth/register` | Register new user account |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/v1/expenses` | Paginated & filtered expenses list |
| `POST` | `/api/v1/expenses` | Create new expense entry |
| `PUT` | `/api/v1/expenses/{id}` | Update existing expense |
| `DELETE` | `/api/v1/expenses/{id}` | Delete expense |
| `POST` | `/api/v1/expenses/bulk-delete` | Delete multiple expenses by ID list |
| `POST` | `/api/v1/expenses/bulk-recategorize` | Bulk reassign category for selected records |
| `POST` | `/api/v1/expenses/import-csv` | Upload and parse CSV expense file |
| `GET` | `/api/v1/categories` | Retrieve available categories & subcategories |
| `POST` | `/api/v1/categories` | Create custom user category |
| `GET` | `/api/v1/budgets` | Get category & overall budgets for selected month |
| `POST` | `/api/v1/budgets` | Set or update monthly category budget |
| `GET` | `/api/v1/recurring` | List active recurring expense schedules |
| `POST` | `/api/v1/recurring/{id}/trigger` | Manually trigger due recurring entry |
| `GET` | `/api/v1/analytics/summary` | Dashboard summary cards & budget alerts |
| `GET` | `/api/v1/analytics/category-breakdown` | Category spend pie chart dataset |
| `GET` | `/api/v1/analytics/monthly-trend` | Month-over-month bar chart dataset |
| `GET` | `/api/v1/analytics/daily-trend` | Daily line chart dataset |
| `GET` | `/api/v1/export/csv` | Download CSV expenses report |
| `GET` | `/api/v1/export/excel` | Download Excel (.xlsx) expenses report |
| `GET` | `/api/v1/export/pdf` | Download formatted PDF expenses report |

---

## Running Unit Tests

```bash
cd backend
# Run unit & integration test suite:
.\mvnw.cmd test
```
