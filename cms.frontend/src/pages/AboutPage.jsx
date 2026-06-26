import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <MainLayout>
            {/* Banner Section */}
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>VỀ CHÚNG TÔI</h1>
                <p className="lead" style={{fontFamily: 'Inter', color: '#ccc'}}>HAI SPORT - Khởi nguồn đam mê sân cỏ</p>
            </div>

            <div className="container py-4 mb-5">
                {/* Back Button */}
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-5 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>

                {/* Section 1: Introduction */}
                <div className="row align-items-center g-5 mb-5">
                    <div className="col-lg-6">
                        <h2 className="brand-font mb-4 display-6">CÂU CHUYỆN CỦA HAI SPORT</h2>
                        <p className="text-secondary mb-4" style={{lineHeight: '1.8'}}>
                            Được thành lập từ tình yêu mãnh liệt với quả bóng tròn, <strong>HAI SPORT</strong> tự hào là hệ thống phân phối giày bóng đá chính hãng hàng đầu. Chúng tôi hiểu rằng đôi giày không chỉ là phụ kiện, mà còn là người bạn đồng hành quyết định từng cú chạm bóng, từng pha bứt tốc trên sân.
                        </p>
                        <p className="text-secondary mb-4" style={{lineHeight: '1.8'}}>
                            Hành trình của chúng tôi bắt đầu từ mong muốn mang lại những đôi giày chất lượng tốt nhất với giá cả hợp lý cho người yêu bóng đá tại Việt Nam. Trải qua nhiều năm phát triển, HAI SPORT đã và đang khẳng định được uy tín trong lòng hàng nghìn cầu thủ phủi và chuyên nghiệp.
                        </p>
                    </div>
                    <div className="col-lg-6">
                        <div className="position-relative">
                            <img src="/banner-giay-bong-da.jpg" alt="About HAI SPORT" className="img-fluid rounded-0 shadow-lg" style={{width: '100%', maxHeight: '400px', objectFit: 'cover'}} />
                            <div className="position-absolute bg-accent text-white p-4 d-none d-md-block" style={{bottom: '-30px', left: '-30px', maxWidth: '250px'}}>
                                <h4 className="font-weight-bold mb-1">5+ Năm</h4>
                                <p className="mb-0 small">Đồng hành cùng đam mê bóng đá Việt</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Values & Mission */}
                <div className="row g-4 mb-5 text-center mt-5">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-soft p-4 rounded-0">
                            <div className="text-accent mb-3">
                                <i className="fas fa-shield-alt fa-3x"></i>
                            </div>
                            <h4 className="fw-bold mb-3" style={{fontFamily: 'Oswald'}}>100% CHÍNH HÃNG</h4>
                            <p className="text-muted mb-0 small">Cam kết hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái. Sự uy tín là tôn chỉ hàng đầu của chúng tôi.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-soft p-4 rounded-0">
                            <div className="text-accent mb-3">
                                <i className="fas fa-truck fa-3x"></i>
                            </div>
                            <h4 className="fw-bold mb-3" style={{fontFamily: 'Oswald'}}>GIAO HÀNG SIÊU TỐC</h4>
                            <p className="text-muted mb-0 small">Dịch vụ đóng gói chuyên nghiệp, giao hàng tận nơi nhanh chóng trên toàn quốc với chính sách xem hàng trước khi thanh toán.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-soft p-4 rounded-0">
                            <div className="text-accent mb-3">
                                <i className="fas fa-undo-alt fa-3x"></i>
                            </div>
                            <h4 className="fw-bold mb-3" style={{fontFamily: 'Oswald'}}>HỖ TRỢ ĐỔI SIZE</h4>
                            <p className="text-muted mb-0 small">Mua online không lo lệch size với chính sách hỗ trợ đổi size linh hoạt trong vòng 7 ngày kể từ khi nhận hàng.</p>
                        </div>
                    </div>
                </div>

                {/* Section 3: Vision */}
                <div className="bg-light p-5 rounded-0 border-start border-accent border-4 mt-5">
                    <h3 className="brand-font mb-3">SỨ MỆNH & TẦM NHÌN</h3>
                    <p className="lead text-secondary mb-0" style={{lineHeight: '1.8', fontSize: '1.15rem'}}>
                        "Sứ mệnh của HAI SPORT là mang đến những công nghệ giày bóng đá tiên tiến nhất từ các thương hiệu lớn như Nike, Adidas, Puma, Mizuno... giúp bảo vệ tối đa đôi chân cầu thủ và nâng tầm trải nghiệm chơi bóng trên khắp sân cỏ Việt Nam."
                    </p>
                </div>
            </div>
        </MainLayout>
    );
};

export default AboutPage;
