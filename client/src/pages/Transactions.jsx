import { useState, useEffect } from 'react';
import { transactionAPI, categoryAPI } from '../api/axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });

  const load = async (p = 1) => {
    const params = { page: p, limit: 20 };
    if (filter) params.type = filter;
    const r = await transactionAPI.getAll(params);
    setTransactions(r.data.transactions);
    setPage(r.data.page);
    setPages(r.data.pages);
  };

  useEffect(() => { load(); }, [filter]);
  useEffect(() => { categoryAPI.getAll().then(r => setCategories(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit) {
      await transactionAPI.update(edit._id, form);
    } else {
      await transactionAPI.create(form);
    }
    setShowForm(false); setEdit(null);
    setForm({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] });
    load();
  };

  const handleEdit = (t) => {
    setEdit(t); setShowForm(true);
    setForm({ type: t.type, amount: t.amount.toString(), category: t.category?._id || '', description: t.description, date: new Date(t.date).toISOString().split('T')[0] });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    await transactionAPI.delete(id);
    load();
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <div className="header-actions">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button className="btn btn-primary" onClick={() => { setEdit(null); setForm({ type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] }); setShowForm(true); }}>+ Add</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-inline">
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value, category: '' }))}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="number" step="0.01" min="0.01" placeholder="Amount" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
            <option value="">Category</option>
            {categories.filter(c => c.type === form.type).map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
          <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <button type="submit" className="btn btn-primary btn-sm">{edit ? 'Update' : 'Add'}</button>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEdit(null); }}>Cancel</button>
        </form>
      )}

      <table className="table">
        <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t._id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td><span className="badge" style={{ background: t.category?.color }}>{t.category?.icon} {t.category?.name}</span></td>
              <td>{t.description}</td>
              <td className={t.type}>₹{t.amount.toFixed(2)}</td>
              <td>
                <button className="btn btn-sm btn-outline" onClick={() => handleEdit(t)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t._id)}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} className={`btn btn-sm ₹{p === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => load(p)}>{p}</button>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
