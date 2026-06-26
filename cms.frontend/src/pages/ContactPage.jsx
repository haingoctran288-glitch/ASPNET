import React from 'react';
import MainLayout from '../layouts/MainLayout';

const ContactPage = () => {
    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>Liên hệ với chúng tôi</h1>
                <p className="lead" style={{fontFamily: 'Inter', color: '#ccc'}}>Phục vụ bạn là niềm vinh hạnh của HAI SPORT</p>
            </div>
            
            <div className="container py-5 mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => window.history.back()} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                <div className="row g-5">
                    <div className="col-lg-6">
                        <h2 className="brand-font mb-4">THÔNG TIN LIÊN HỆ</h2>
                        <p className="text-secondary mb-5">Đừng ngần ngại liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ về sản phẩm giày bóng đá. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                        
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-accent text-white d-flex justify-content-center align-items-center me-4" style={{width: '60px', height: '60px'}}>
                                <i className="fas fa-map-marker-alt fs-3"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1" style={{fontFamily: 'Oswald'}}>ĐỊA CHỈ</h5>
                                <p className="text-muted mb-0">123 Đường Cầu Giấy, Hà Nội, Việt Nam</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-accent text-white d-flex justify-content-center align-items-center me-4" style={{width: '60px', height: '60px'}}>
                                <i className="fas fa-phone-alt fs-3"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1" style={{fontFamily: 'Oswald'}}>ĐIỆN THOẠI</h5>
                                <p className="text-muted mb-0">1900 1234 (Hỗ trợ 24/7)</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <div className="bg-accent text-white d-flex justify-content-center align-items-center me-4" style={{width: '60px', height: '60px'}}>
                                <i className="fas fa-envelope fs-3"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1" style={{fontFamily: 'Oswald'}}>EMAIL</h5>
                                <p className="text-muted mb-0">cskh@haisport.com</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="card border-0 rounded-0 bg-light p-4 p-md-5 shadow-sm">
                            <h3 className="brand-font mb-4">GỬI TIN NHẮN CHO CHÚNG TÔI</h3>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>HỌ VÀ TÊN</label>
                                    <input type="text" className="form-control rounded-0 border-0 shadow-sm p-3" placeholder="Nhập họ tên của bạn..." />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>EMAIL</label>
                                    <input type="email" className="form-control rounded-0 border-0 shadow-sm p-3" placeholder="Nhập email..." />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>NỘI DUNG</label>
                                    <textarea className="form-control rounded-0 border-0 shadow-sm p-3" rows="5" placeholder="Bạn muốn nhắn nhủ điều gì?"></textarea>
                                </div>
                                <button type="button" className="btn-premium w-100">
                                    GỬI TIN NHẮN <i className="fas fa-paper-plane ms-2"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContactPage;
