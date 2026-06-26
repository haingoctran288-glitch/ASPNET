import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const HeroBanner = () => {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        // Lấy danh sách sản phẩm hot làm banner
        axiosClient.get('/ProductApi/hot')
            .then(res => {
                // Lấy tối đa 3 sản phẩm nổi bật
                setSlides(res.data.slice(0, 3));
            })
            .catch(err => console.error(err));
    }, []);

    if (slides.length === 0) {
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
    }

    return (
        <div id="heroCarousel" className="carousel slide carousel-fade mb-5" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-indicators">
                {slides.map((_, index) => (
                    <button key={index} type="button" data-bs-target="#heroCarousel" data-bs-slide-to={index} className={index === 0 ? "active" : ""} aria-current={index === 0 ? "true" : "false"} aria-label={`Slide ${index + 1}`}></button>
                ))}
            </div>
            
            <div className="carousel-inner">
                {slides.map((item, index) => {
                    const imgUrl = item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5173${item.imageUrl}`) : '/banner-giay-bong-da.jpg';
                    
                    return (
                        <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`} style={{minHeight: '80vh', background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('${imgUrl}') no-repeat center/cover`, backgroundAttachment: 'fixed'}}>
                            <div className="container d-flex align-items-center h-100" style={{minHeight: '80vh'}}>
                                <div className="row w-100">
                                    <div className="col-lg-8">
                                        <div className="badge bg-danger mb-3 px-3 py-2 fs-6">SẢN PHẨM NỔI BẬT</div>
                                        <h1 className="fw-bolder mb-3 text-white brand-font text-uppercase" style={{fontSize: '4.5rem', lineHeight: '1.1', textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}>
                                            {item.name}
                                        </h1>
                                        <p className="lead mb-5 text-light" style={{fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                                            {item.description}
                                        </p>
                                        <div className="d-flex align-items-center gap-4">
                                            <Link to={`/product/${item.id}`} className="btn btn-accent px-5 py-3 fw-bold text-uppercase d-inline-flex align-items-center" style={{fontSize: '1.2rem', fontFamily: 'Oswald', letterSpacing: '1px'}}>
                                                XEM CHI TIẾT <i className="fas fa-arrow-right ms-3"></i>
                                            </Link>
                                            <span className="text-white fs-3 fw-bold brand-font">{item.price.toLocaleString('vi-VN')} ₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" style={{width: '3rem', height: '3rem'}}></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" style={{width: '3rem', height: '3rem'}}></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default HeroBanner;
