import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import MenuFilters from '../components/MenuFilters';
import { useCart } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { cleanId } from '../utils/cleanId';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiService } from '../service/apiService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const Menu = () => {
  const { tableId: paramTableId } = useParams();
  const navigate = useNavigate();
  const { tableId: contextTableId, setTableId } = useCart();
  const { user, loading } = useContext(AuthContext);

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    const rawParam = paramTableId;
    const rawContext = contextTableId;
    const rawStorage = localStorage.getItem('tableId');
    const p = cleanId(rawParam);
    const c = cleanId(rawContext);
    const s = cleanId(rawStorage);
    const t = p || c || s;

    if (!t) {
      navigate('/');
      return;
    }

    if (!user && t) {
      navigate('/login', {
        state: { 
          from: { pathname: `/menu/${t}` },
          tableId: t 
        }
      });
      return;
    }

    setTableId(t);
    localStorage.setItem('tableId', t);

    const loadData = async () => {
      try {
        const [foodsData, categoriesData] = await Promise.all([
          apiService.getFoods(), // Không cần truyền page, limit
          apiService.getCategories(),
        ]);

        setFoods(foodsData);
        setCategories(categoriesData);

        if (foodsData.length > 0) {
          const prices = foodsData.map(food => food.price);
          setPriceRange({ min: Math.min(...prices), max: Math.max(...prices) });
        }
      } catch (error) {
        console.error('Lỗi khi tải menu:', error);
      } finally {
        setMenuLoading(false);
      }
    };

    loadData();
  }, [paramTableId, contextTableId, navigate, setTableId, user, loading]);

  const filteredFoods = React.useMemo(() => {
    let result = foods;

    if (selectedCategory !== 'all') {
      const selectedCategoryName = categories.find(cat => cat._id === selectedCategory)?.name;
      if (selectedCategoryName) {
        result = result.filter(food => food.category === selectedCategoryName);
      }
    }

    result = result.filter(food => 
      food.price >= priceRange.min && food.price <= priceRange.max
    );

    if (searchTerm) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return result;
  }, [foods, selectedCategory, priceRange, searchTerm]);

  const maxPrice = foods.length > 0 ? Math.max(...foods.map(f => f.price)) : 1000000;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Đang kiểm tra đăng nhập...</h4>
        </div>
      </div>
    );
  }

  if (menuLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <div className="spinner-border mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Đang tải thực đơn...</h4>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Hero />
      
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row">

            <div className="col-lg-3 mb-4">
              <MenuFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
              />
            </div>

            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  {filteredFoods.length > 0 ? (
                    <>Tìm thấy <span className="text-primary fw-bold">{filteredFoods.length}</span> món ăn</>
                  ) : (
                    <span className="text-muted">Không tìm thấy món ăn nào</span>
                  )}
                </h5>
                {(selectedCategory !== 'all' || searchTerm || priceRange.min > 0 || priceRange.max < maxPrice) && (
                  <button 
                    className="btn btn-link p-0 text-decoration-none small"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchTerm('');
                      setPriceRange({ min: 0, max: maxPrice });
                    }}
                  >
                    <i className="fas fa-times me-1"></i>
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>

              <div className="row g-4">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <div key={food._id || food.id} className="col-lg-4 col-md-6">
                      <FoodCard food={food} />
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="text-center py-5">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <h4 className="text-muted">Không tìm thấy món ăn nào</h4>
                      <p className="text-muted">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      <button 
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => {
                          setSelectedCategory('all');
                          setSearchTerm('');
                          setPriceRange({ min: 0, max: maxPrice });
                        }}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Menu;