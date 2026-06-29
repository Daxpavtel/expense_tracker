# 💰 Expense Tracker

A full-stack expense tracking application with income/expense categorization, monthly & yearly summaries, and interactive analytics charts.

**🌐 Live Demo:** [expense-tracker-now.vercel.app](https://expense-tracker-now.vercel.app/)
**🔗 API:** [expense-tracker-d06r.onrender.com](https://expense-tracker-d06r.onrender.com/)

## ✨ Features

- **User Authentication** – Register/Login with JWT-based secure auth
- **Income & Expense Tracking** – Categorize transactions with custom icons & colors
- **CRUD Operations** – Full create, read, update, delete for transactions and categories
- **Monthly & Yearly Summaries** – Auto-calculated income, expense, and balance
- **Interactive Charts** – Bar charts (income vs expense), Pie charts (category breakdown)
- **Data Aggregation** – MongoDB aggregation pipelines for real-time analytics
- **Pagination** – Server-side paginated transaction list with filters
- **Responsive UI** – Clean, mobile-friendly design

## 🛠 Tech Stack

| Layer       | Technology                                      |
| ----------- | ----------------------------------------------- |
| Frontend    | React 18, React Router 6, Recharts, Axios       |
| Backend     | Node.js, Express.js                             |
| Database    | MongoDB, Mongoose ODM                           |
| Auth        | JWT (jsonwebtoken), bcryptjs                    |
| Validation  | express-validator                               |
| Security    | Rate limiting, CORS, password hashing            |
| Dev Tools   | Nodemon, Concurrently                           |

## 📁 Project Structure

```
expense-tracker/
├── client/                     # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── api/                # Axios API client
│       │   └── axios.js
│       ├── components/         # Reusable UI components
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/            # React context (auth)
│       │   └── AuthContext.jsx
│       ├── pages/              # Route pages
│       │   ├── Dashboard.jsx
│       │   ├── Transactions.jsx
│       │   ├── Categories.jsx
│       │   ├── Analytics.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       ├── App.jsx
│       ├── index.jsx
│       └── index.css
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── controllers/        # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── categoryController.js
│   │   │   └── analyticsController.js
│   │   ├── middleware/         # Auth, validation, error handling
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   └── Category.js
│   │   ├── routes/             # Express routes
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   ├── categories.js
│   │   │   └── analytics.js
│   │   └── app.js              # Express app entry
│   ├── seed.js                 # Sample data seeder
│   ├── .env                    # Environment variables
│   └── package.json
├── docker-compose.yml          # MongoDB container
├── dev.js                      # Dev runner (server + client)
└── package.json                # Root scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** v7+ (local or [Atlas](https://www.mongodb.com/atlas))
- **npm** v9+

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd expense-tracker
npm run install:all
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_random_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Start MongoDB

**Option A – Local install:**
```bash
mongod
```

**Option B – Docker:**
```bash
docker-compose up -d mongodb
```

**Option C – MongoDB Atlas:**  
Replace `MONGODB_URI` in `server/.env` with your Atlas connection string.

### 4. Run the App

```bash
# Development (server + client concurrently)
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

### 5. Seed Sample Data (Optional)

```bash
node server/seed.js your-email@example.com
```

This creates 10 sample Indian-rupee transactions and categories.  
If no email is provided, it creates a demo user: `demo@example.com` / `demo123456`.

## 📡 API Endpoints

### Auth
| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login              |
| GET    | `/api/auth/me`       | Get current user   |

### Transactions
| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/transactions`     | List (paginated, filterable) |
| GET    | `/api/transactions/:id` | Get single transaction   |
| POST   | `/api/transactions`     | Create transaction       |
| PUT    | `/api/transactions/:id` | Update transaction       |
| DELETE | `/api/transactions/:id` | Delete transaction       |

### Categories
| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/categories`      | List all categories |
| POST   | `/api/categories`      | Create category    |
| PUT    | `/api/categories/:id`  | Update category    |
| DELETE | `/api/categories/:id`  | Delete category    |

### Analytics
| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/analytics/monthly` | Monthly summary (income, expense, by category) |
| GET    | `/api/analytics/yearly`  | Yearly summary (monthly trends, category breakdown) |

## 📊 Analytics

The analytics module uses **MongoDB aggregation pipelines** to compute:

- **Monthly snapshots** – Total income, expense, balance with category-wise breakdown
- **Yearly reports** – Per-month trends, annual totals, expense distribution
- **Real-time** – All calculations run on-demand against live data

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

## 📄 License

MIT
