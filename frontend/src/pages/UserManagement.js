import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { apiService } from '../service/apiService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';

const emptyUser = { name: '', email: '', phone: '', role: 'customer' };

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(emptyUser);

  const loadUsers = async () => {
  setLoading(true);
  const raw = await apiService.getUsers();
  setUsers(Array.isArray(raw?.data?.users) ? raw.data.users : []);
  setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const openCreate = () => {
    setEdit(null);
    setForm(emptyUser);
    setShow(true);
  };
  const openEdit = user => {
    setEdit(user);
    setForm(user);
    setShow(true);
  };

  const removeUser = async user => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      await apiService.deleteUser(user.id);
      loadUsers();
    }
  };

  const saveUser = async e => {
    e.preventDefault();
    if (edit) {
      await apiService.updateUser(edit.id, form);
    } else {
      await apiService.createUser(form);
    }
    setShow(false);
    loadUsers();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role' },
    { key: 'createdAt', label: 'Created At', render: d => new Date(d).toLocaleDateString() }
  ];

  if (loading) return <div className="p-3">Loading...</div>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>User Management</h3>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus className="me-1" /> Thêm User
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        onEdit={openEdit}
        onDelete={removeUser}
      />

      <Modal isOpen={show} onClose={() => setShow(false)} title={edit ? 'Edit User' : 'Add User'}>
        <form onSubmit={saveUser}>
          {['name', 'email', 'phone'].map(f => (
            <div className="mb-3" key={f}>
              <label className="form-label text-capitalize">{f}</label>
              <input
                type={f === 'email' ? 'email' : f === 'phone' ? 'tel' : 'text'}
                className="form-control"
                value={form[f]}
                onChange={e => setForm({ ...form, [f]: e.target.value })}
                required={f !== 'phone'}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              {['customer', 'admin', 'staff'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary me-2">
              {edit ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShow(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;