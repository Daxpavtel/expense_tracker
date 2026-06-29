import { useState, useEffect } from 'react';
import { analyticsAPI } from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);

  useEffect(() => {
    analyticsAPI.monthly({ year, month }).then(r => setMonthlyData(r.data));
  }, [year, month]);

  useEffect(() => {
    analyticsAPI.yearly({ year }).then(r => setYearlyData(r.data));
  }, [year]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>

      <div className="analytics-controls">
        <select value={year} onChange={e => setYear(Number(e.target.value))}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}>
          {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
      </div>

      {monthlyData && (
        <>
          <div className="summary-cards">
            <div className="card card-income"><h3>Monthly Income</h3><p>₹{monthlyData.income.toFixed(2)}</p></div>
            <div className="card card-expense"><h3>Monthly Expense</h3><p>₹{monthlyData.expense.toFixed(2)}</p></div>
            <div className="card card-balance"><h3>Balance</h3><p>₹{monthlyData.balance.toFixed(2)}</p></div>
          </div>

          <div className="chart-box">
            <h3>Monthly Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={monthlyData.byCategory.filter(c => c._id.type === 'expense').map(c => ({ name: c._id.name, value: c.total, color: c._id.color }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {monthlyData.byCategory.filter(c => c._id.type === 'expense').map((entry, i) => <Cell key={i} fill={entry._id.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {yearlyData && (
        <>
          <h2>Yearly Summary - {year}</h2>
          <div className="summary-cards">
            <div className="card card-income"><h3>Yearly Income</h3><p>₹{yearlyData.income.toFixed(2)}</p></div>
            <div className="card card-expense"><h3>Yearly Expense</h3><p>₹{yearlyData.expense.toFixed(2)}</p></div>
            <div className="card card-balance"><h3>Net</h3><p>₹{yearlyData.balance.toFixed(2)}</p></div>
          </div>

          <div className="chart-box">
            <h3>Monthly Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={months.map((m, i) => {
                const income = yearlyData.monthly.find(d => d._id.month === i + 1 && d._id.type === 'income');
                const expense = yearlyData.monthly.find(d => d._id.month === i + 1 && d._id.type === 'expense');
                return { name: m, Income: income?.total || 0, Expense: expense?.total || 0 };
              })}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Income" fill="#10b981" />
                <Bar dataKey="Expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
