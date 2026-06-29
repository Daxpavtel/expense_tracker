import { useState, useEffect } from 'react';
import { categoryAPI } from '../api/axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'expense', color: '#6b7280', icon: '📁' });

  const load = () => categoryAPI.getAll().then(r => setCategories(r.data));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (edit) {
      await categoryAPI.update(edit._id, form);
    } else {
      await categoryAPI.create(form);
    }
    setShowForm(false); setEdit(null);
    setForm({ name: '', type: 'expense', color: '#6b7280', icon: '📁' });
    load();
  };

  const handleEdit = (c) => {
    setEdit(c); setShowForm(true);
    setForm({ name: c.name, type: c.type, color: c.color, icon: c.icon });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await categoryAPI.delete(id);
    load();
  };

  const icons = ['💰', '💼', '🍕', '🚗', '🏠', '🏥', '📚', '🎮', '✈️', '👕', '💊', '🐾', '🎁', '📦', '💡', '📱', '💳', '🏦', '📈', '🛒'];

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories</h1>
        <button className="btn btn-primary" onClick={() => { setEdit(null); setForm({ name: '', type: 'expense', color: '#6b7280', icon: '📁' }); setShowForm(true); }}>+ Add</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-inline">
          <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
            {icons.map(ic => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} />
          <button type="submit" className="btn btn-primary btn-sm">{edit ? 'Update' : 'Add'}</button>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { setShowForm(false); setEdit(null); }}>Cancel</button>
        </form>
      )}

      <div className="category-grid">
        {categories.map(c => (
          <div key={c._id} className="category-card" style={{ borderLeftColor: c.color }}>
            <span className="cat-icon">{c.icon}</span>
            <div className="cat-info">
              <strong>{c.name}</strong>
              <span className={`cat-type ${c.type}`}>{c.type}</span>
            </div>
            <div className="cat-actions">
              <button className="btn btn-sm btn-outline" onClick={() => handleEdit(c)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
