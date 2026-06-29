import { useState, useEffect } from 'react';
import { analyticsAPI, transactionAPI } from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const now = new Date();

  useEffect(() => {
    analyticsAPI.monthly({ year: now.getFullYear(), month: now.getMonth() + 1 }).then(r => setSummary(r.data));
    transactionAPI.getAll({ limit: 5 }).then(r => setRecent(r.data.transactions));
  }, []);

  if (!summary) return <div className="loading">Loading...</div>;

  const pieData = summary.byCategory
    .filter(c => c._id.type === 'expense')
    .map(c => ({ name: c._id.name, value: c.total, color: c._id.color }));

  const COLORS = ['#10b981', '#ef4444'];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="summary-cards">
        <div className="card card-income"><h3>Income</h3><p>₹{summary.income.toFixed(2)}</p></div>
        <div className="card card-expense"><h3>Expense</h3><p>₹{summary.expense.toFixed(2)}</p></div>
        <div className="card card-balance"><h3>Balance</h3><p>₹{summary.balance.toFixed(2)}</p></div>
      </div>

      <div className="charts-row">
        <div className="chart-box">
          <h3>Income vs Expense</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { name: 'Income', amount: summary.income },
              { name: 'Expense', amount: summary.expense },
            ]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h3>Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-transactions">
        <h3>Recent Transactions</h3>
        <table className="table">
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
          <tbody>
            {recent.map(t => (
              <tr key={t._id} className={t.type}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td><span className="badge" style={{ background: t.category?.color }}>{t.category?.icon} {t.category?.name}</span></td>
                <td>{t.description}</td>
                <td className={t.type}>₹{t.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
