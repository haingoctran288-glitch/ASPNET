import React from 'react';

const HeroBanner = () => {
    return (
        <div className="hero-banner text-white d-flex align-items-center mb-5" style={{minHeight: '80vh', background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('/banner-giay-bong-da.jpg') no-repeat center/cover", backgroundAttachment: 'fixed'}}>
            <div className="container position-relative z-index-1">
                <div className="row">
                    <div className="col-lg-8">
                        <h1 className="fw-bolder mb-3 fade-in-up brand-font text-uppercase" style={{fontSize: '5rem', lineHeight: '1.1', textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
                            BỨT PHÁ <br/>
                            <span className="text-accent">MỌI GIỚI HẠN</span>
                        </h1>
                        <p className="lead mb-5 fade-in-up delay-1" style={{fontSize: '1.2rem', maxWidth: '600px', color: '#dddddd'}}>
                            Chinh phục mọi mặt sân với bộ sưu tập giày bóng đá chính hãng. Thiết kế siêu nhẹ, ôm sát chân và hỗ trợ bức tốc tối đa.
                        </p>
                        <a href="#products" className="btn btn-accent px-5 py-3 fw-bold fade-in-up delay-2 text-uppercase d-inline-flex align-items-center" style={{fontSize: '1.2rem', fontFamily: 'Oswald', letterSpacing: '1px', textDecoration: 'none'}}>
                            LÊN ĐỒ RA SÂN <i className="fas fa-arrow-right ms-3"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
