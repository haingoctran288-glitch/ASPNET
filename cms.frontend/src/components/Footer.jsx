import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-4 mt-5 shadow-lg">
            <div className="container text-center text-md-start">
                <div className="row">
                    <div className="col-md-4 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4 fs-4 text-gradient">
                            <i className="fas fa-futbol me-2"></i>HAI SPORT
                        </h6>
                        <p className="text-secondary">Trải nghiệm mua sắm đồ thể thao và giày bóng đá chính hãng. Sản phẩm được đồng bộ realtime từ hệ thống CMS Backend.</p>
                    </div>
                    <div className="col-md-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Liên kết</h6>
                        <p><Link to="/about" className="text-secondary text-decoration-none hover-white">Về chúng tôi</Link></p>
                        <p><Link to="/products" className="text-secondary text-decoration-none hover-white">Sản phẩm</Link></p>
                        <p><Link to="/posts" className="text-secondary text-decoration-none hover-white">Tin tức thể thao</Link></p>
                        <p><Link to="/policy" className="text-secondary text-decoration-none hover-white">Chính sách đổi trả</Link></p>
                        <p><Link to="/contact" className="text-secondary text-decoration-none hover-white">Liên hệ</Link></p>
                    </div>
                    <div className="col-md-3 mx-auto mb-md-0 mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                        <p className="text-secondary"><i className="fas fa-home me-3"></i> TPHCM, VN</p>
                        <p className="text-secondary"><i className="fas fa-envelope me-3"></i> info@haistore.vn</p>
                    </div>
                </div>
            </div>
            <div className="text-center p-4 border-top border-secondary mt-3">
                © 2026 Copyright: <span className="fw-bold text-gradient">Trần Ngọc Hải</span>
            </div>
        </footer>
    );
};

export default Footer;
