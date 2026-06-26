import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const ProductList = ({ title, endpoint }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get(endpoint)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [endpoint]);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <h2 className="brand-font fs-1 m-0">{title}</h2>
                <Link to="/products" className="text-dark fw-bold text-decoration-none text-uppercase" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>
                    Xem tất cả <i className="fas fa-arrow-right ms-1"></i>
                </Link>
            </div>
            <div className="row g-4 justify-content-center">
                {products.map(p => {
                    const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "https://via.placeholder.com/400x300";
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5173${imgUrl}`;
                    return (
                    <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                        <div className="card h-100 border-0 rounded-0 product-card">
                            <div className="img-wrapper overflow-hidden bg-light position-relative" style={{height: '220px'}}>
                                <Link to={`/product/${p.id}`}>
                                    <img src={fullImg} className="card-img-top img-zoom rounded-0" alt={p.name} style={{height: '100%', width: '100%', objectFit: 'contain', padding: '10px'}} />
                                </Link>
                                {p.productTag === 'HOT' && (
                                    <span className="badge bg-accent position-absolute top-0 start-0 m-3 px-3 py-2 rounded-0 shadow-sm" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>HOT</span>
                                )}
                                {p.productTag === 'Mới' && (
                                    <span className="badge bg-dark position-absolute top-0 start-0 m-3 px-3 py-2 rounded-0 shadow-sm" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>MỚI</span>
                                )}
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                                <Link to={`/product/${p.id}`} className="text-decoration-none">
                                    <h5 className="card-title fw-bold text-dark text-uppercase mb-2" style={{fontFamily: 'Oswald', letterSpacing: '0.5px', fontSize: '1.25rem'}}>{p.name}</h5>
                                </Link>
                                <p className="card-text text-secondary small text-truncate-2 mb-3">{p.description}</p>
                                <div className="mt-auto d-flex justify-content-between align-items-center">
                                    <span className="fs-5 fw-bold text-dark">{p.price.toLocaleString('vi-VN')} ₫</span>
                                    {p.stockQuantity > 0 ? (
                                        <span className="text-success small fw-semibold">Còn hàng</span>
                                    ) : (
                                        <span className="text-danger small fw-semibold">Hết hàng</span>
                                    )}
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                <Link to={`/product/${p.id}`} className="btn-premium d-block w-100 text-center text-decoration-none py-2">
                                    XEM CHI TIẾT
                                </Link>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default ProductList;
