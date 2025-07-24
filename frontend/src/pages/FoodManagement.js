import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {apiService} from '../service/apiService';
import Table from '../components/Table';
import Modal from '../components/Modal';
import SearchBar from '../components/SearchBar';

const FoodManagement = () => {
  const [foods,setFoods]=useState([]);
  const [load,setLoad]=useState(true);
  const [show,setShow]=useState(false);
  const [edit,setEdit]=useState(null);
  const [search,setSearch]=useState('');
  const [form,setForm]=useState({name:'',description:'',price:'',category:'',image:''});

  const loadData = async () => {
    setLoad(true);
    try {
      const foodsArray = await apiService.getFoods(); 
      setFoods(foodsArray.map(f => ({ ...f, id: f._id })));
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu món ăn:', err);
      alert('Không thể tải dữ liệu món ăn');
    } finally {
      setLoad(false);
    }
  };

  useEffect(()=>{ loadData(); }, []);

  const openCreate=()=>{ setEdit(null); setForm({name:'',description:'',price:'',category:'',image:''}); setShow(true); };
  const openEdit   =u =>{ setEdit(u); setForm(u); setShow(true); };
  const remove     =u =>{ if(window.confirm('Xóa món này?')){ apiService.deleteFood(u.id).then(loadData); }};

  const save = async e => {
  e.preventDefault();
  try {
    if (edit) {
      await apiService.updateFood(edit.id, form);
    } else {
      await apiService.createFood(form);
    }
    setShow(false);   
    loadData();       
  } catch (err) {
    alert('Có lỗi xảy ra khi thêm/cập nhật món ăn!');
  }
 };

  const filtered = foods.filter(f =>
    (f.name && f.name.toLowerCase().includes(search.toLowerCase())) ||
    (f.category && f.category.toLowerCase().includes(search.toLowerCase()))
  );

  const cols = [
    { key:'name', label:'Name' },
    { key:'description', label:'Description' },
    { key:'price', label:'Price', render:p=>`${p}₫` },
    { key:'category', label:'Category' }
  ];

  if(load) return <div>Loading...</div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Food Management</h3>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus className="me-1"/> Thêm Food
        </button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search foods..." />

      <Table columns={cols} data={filtered} onEdit={openEdit} onDelete={remove} />

      <Modal isOpen={show} onClose={()=>setShow(false)} title={edit?'Edit Food':'Add Food'}>
        <form onSubmit={save}>
          {['name','description','price','category','image'].map(f=>(
            <div className="mb-3" key={f}>
              <label className="form-label text-capitalize">{f}</label>
              {f==='description' ? (
                <textarea className="form-control" rows="3" value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}/>
              ) : (
                <input
                  type={f==='price'?'number': f==='image'?'url':'text'}
                  className="form-control"
                  value={form[f]}
                  onChange={e=>setForm({...form,[f]:e.target.value})}
                  required={f!=='image'}
                />
              )}
            </div>
          ))}
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary me-2">{edit?'Update':'Create'}</button>
            <button type="button" className="btn btn-secondary" onClick={()=>setShow(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default FoodManagement;
