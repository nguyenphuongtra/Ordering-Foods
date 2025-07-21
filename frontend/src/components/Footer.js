const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>FOOD</h5>
            <p>Trải nghiệm ẩm thực hảo hạng với nguyên liệu tươi ngon và chế biến chuyên nghiệp.</p>
          </div>
          <div className="col-md-6">
            <h5>Liên hệ</h5>
            <p>DaNang, VietNam</p>
            <p>987654321</p>
            <p>team1@gmail.com</p>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p className="mb-0">&copy; 2025 Restaurant Food.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;