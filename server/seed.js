require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Transaction = require('./src/models/Transaction');

const INCOME_CATEGORIES = [
  { name: 'Salary', color: '#10b981', icon: '💰' },
  { name: 'Freelance', color: '#3b82f6', icon: '💼' },
  { name: 'Investments', color: '#8b5cf6', icon: '📈' },
];

const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', color: '#f59e0b', icon: '🍕' },
  { name: 'Transport', color: '#ef4444', icon: '🚗' },
  { name: 'Rent', color: '#6366f1', icon: '🏠' },
  { name: 'Shopping', color: '#ec4899', icon: '👕' },
  { name: 'Entertainment', color: '#14b8a6', icon: '🎮' },
  { name: 'Healthcare', color: '#f97316', icon: '🏥' },
  { name: 'Bills & Utilities', color: '#6b7280', icon: '💡' },
];

const SAMPLE_TRANSACTIONS = [
  { type: 'expense', amount: 450, description: 'Lunch at Paradise Biryani', daysAgo: 1, catName: 'Food & Dining' },
  { type: 'expense', amount: 200, description: 'Auto rickshaw to office', daysAgo: 1, catName: 'Transport' },
  { type: 'expense', amount: 1200, description: 'Electricity bill payment', daysAgo: 3, catName: 'Bills & Utilities' },
  { type: 'expense', amount: 2500, description: 'Monthly grocery - DMart', daysAgo: 4, catName: 'Food & Dining' },
  { type: 'expense', amount: 15000, description: 'Monthly Rent - 1BHK', daysAgo: 5, catName: 'Rent' },
  { type: 'expense', amount: 1800, description: 'New kurta from Myntra', daysAgo: 6, catName: 'Shopping' },
  { type: 'expense', amount: 600, description: 'Movie tickets + popcorn', daysAgo: 7, catName: 'Entertainment' },
  { type: 'income', amount: 65000, description: 'Monthly salary', daysAgo: 2, catName: 'Salary' },
  { type: 'income', amount: 5000, description: 'Freelance web design project', daysAgo: 5, catName: 'Freelance' },
  { type: 'expense', amount: 800, description: 'Doctor consultation fee', daysAgo: 8, catName: 'Healthcare' },
];

async function seed() {
  const email = process.argv[2] || 'demo@example.com';
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: 'Demo User',
        email,
        password: 'demo123456',
      });
      console.log(`Created demo user: ${email} / demo123456`);
    } else {
      console.log(`Using existing user: ${email}`);
    }

    const existingCategories = await Category.countDocuments({ user: user._id });
    const catMap = {};

    if (existingCategories === 0) {
      for (const cat of [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]) {
        const created = await Category.create({ ...cat, type: INCOME_CATEGORIES.includes(cat) ? 'income' : 'expense', user: user._id });
        catMap[cat.name] = created._id;
      }
      console.log(`Created ${catMap.size} categories`);
    } else {
      const cats = await Category.find({ user: user._id });
      cats.forEach(c => { catMap[c.name] = c._id; });
      console.log(`Using ${cats.length} existing categories`);
    }

    await Transaction.deleteMany({ user: user._id });
    console.log('Cleared existing transactions');

    for (const txn of SAMPLE_TRANSACTIONS) {
      const date = new Date();
      date.setDate(date.getDate() - txn.daysAgo);
      await Transaction.create({
        user: user._id,
        category: catMap[txn.catName],
        type: txn.type,
        amount: txn.amount,
        description: txn.description,
        date,
      });
    }
    console.log(`Created ${SAMPLE_TRANSACTIONS.length} sample transactions`);
    console.log('\nSeed complete! Login with:');
    console.log(`  Email: ${email}`);
    console.log(`  Password: demo123456`);

  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
