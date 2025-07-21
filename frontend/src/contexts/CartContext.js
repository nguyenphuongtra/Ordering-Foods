import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../service/apiService';
import { AuthContext } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Hàm load giỏ hàng và table từ backend
  const loadCartFromDB = async (userId) => {
    setIsLoading(true);
    try {
      const res = await apiService.getCart(userId);
      setCartItems(res.items || []);
      setTableId(res.table || null);
      // Lưu tableId xuống localStorage để client nhớ
      if (res.table) {
        localStorage.setItem('tableId', res.table);
      }
    } catch (err) {
      console.error('Không thể tải giỏ hàng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Lần đầu khi mount, lấy tableId từ localStorage
    const storedTable = localStorage.getItem('tableId');
    if (storedTable) {
      setTableId(storedTable.startsWith(':')
        ? storedTable.slice(1)
        : storedTable
      );
    }
    // Khi có user, tải cart & table từ backend
    if (user?._id) {
      loadCartFromDB(user._id);
    }
  }, [user]);

  const addToCart = async (food) => {
    if (!user?._id) return alert('Bạn cần đăng nhập trước');

    const id = food.id || food._id;
    const existing = cartItems.find(item => item.id === id);

    try {
      await apiService.addToCart({
        userId: user._id,
        foodId: id,
        quantity: 1,
      });

      if (existing) {
        setCartItems(prev =>
          prev.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        setCartItems(prev => [...prev, { ...food, id, quantity: 1 }]);
      }
    } catch (err) {
      console.error('Không thể thêm vào giỏ hàng:', err);
    }
  };

  const updateQuantity = async (foodId, newQuantity) => {
    if (!user?._id) return;

    if (newQuantity <= 0) return removeFromCart(foodId);

    try {
      await apiService.updateCart({
        userId: user._id,
        foodId,
        quantity: newQuantity,
      });

      setCartItems(prev =>
        prev.map(item =>
          item.id === foodId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Không thể cập nhật giỏ hàng:', err);
    }
  };

  const removeFromCart = async (foodId) => {
    if (!user?._id) return;

    try {
      await apiService.removeFromCart({ userId: user._id, foodId });
      setCartItems(prev => prev.filter(item => item.id !== foodId));
    } catch (err) {
      console.error('Không thể xoá khỏi giỏ hàng:', err);
    }
  };

  const clearCart = async () => {
    if (!user?._id) return;
    try {
      await apiService.clearCart(user._id);
      setCartItems([]);
      setTableId(null);
      localStorage.removeItem('tableId');
    } catch (err) {
      console.error('Không thể xoá giỏ hàng:', err);
    }
  };

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        tableId,
        setTableId,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
