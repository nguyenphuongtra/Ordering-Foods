import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';
import '../style/StaticPage.css';

const Contact = () => {
  return (
    <>
      <Header />
      <div className="static-page-container">
        <h2>Liên hệ</h2>
        <p>Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ với chúng tôi qua các thông tin dưới đây:</p>
        <ul>
          <li><Mail size={20} /> Email: nguyenthanhtra@gmail.com</li>
          <li><Phone size={20} /> Điện thoại: 035480142</li>
          <li><MapPin size={20} /> Địa chỉ: Hải Châu/ Đà Nẵng</li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
