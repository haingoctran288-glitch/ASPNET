import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';
import { CartContext } from '../context/CartContext';
const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerUrl, setBannerUrl] = useState('/banner-giay-bong-da.jpg');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    
    // Parse query parameter
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    const handleBuyNow = (p) => {
        let defaultSize = '';
        if (p.sizes) {
            defaultSize = p.sizes.split(',')[0].trim();
        }
        
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = currentCart.find(i => i.id === p.id && i.selectedSize === defaultSize);
        let cartItemId = Date.now().toString();
        
        if(!existing) {
            const newItem = { ...p, quantity: 1, selectedSize: defaultSize, cartItemId };
            currentCart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
        } else {
            cartItemId = existing.cartItemId;
            existing.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(currentCart));
        }
        
        localStorage.setItem('selectedItems', JSON.stringify([cartItemId]));
        window.location.href = '/checkout';
    };

    useEffect(() => {
        setLoading(true);
        const url = categoryId ? `/ProductApi/category/${categoryId}` : '/ProductApi';
        
        axiosClient.get(url)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
                setCurrentPage(1);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
            
        // Lấy banner
        axiosClient.get('/PostApi/banners')
            .then(res => {
                if(res.data && res.data.length > 0) {
                    const imgUrl = res.data[0].imageUrl;
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5173${imgUrl}`;
                    setBannerUrl(fullImg);
                }
            })
            .catch(err => console.error(err));
    }, [categoryId]);

    // Pagination calculations
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bannerUrl}) center/cover`}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>{categoryId ? "Sản phẩm theo danh mục" : "Tất cả sản phẩm"}</h1>
                <p className="lead" style={{fontFamily: 'Inter', color: '#ccc'}}>Khám phá toàn bộ kho hàng siêu khủng của HAI SPORT</p>
            </div>
            <div className="container mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => window.history.back()} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
                ) : (
                    <>
                        <div className="row g-4 justify-content-center">
                            {currentProducts.map(p => {
                                const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "https://via.placeholder.com/400x300";
                                const fullImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5173${imgUrl}`;
                                return (
                                <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
                                    <div className="card h-100 border-0 rounded-0 product-card">
                                        <div className="img-wrapper overflow-hidden bg-light position-relative" style={{height: '220px'}}>
                                            <Link to={`/product/${p.id}`}>
                                                <img src={fullImg} className="card-img-top img-zoom rounded-0" alt={p.name} style={{height: '100%', width: '100%', objectFit: 'contain', padding: '10px'}} />
                                            </Link>
                                        </div>
                                        <div className="card-body p-4 d-flex flex-column">
                                            <Link to={`/product/${p.id}`} className="text-decoration-none">
                                                <h5 className="card-title fw-bold text-dark text-uppercase mb-2" style={{fontFamily: 'Oswald', letterSpacing: '0.5px', fontSize: '1.1rem'}}>{p.name}</h5>
                                            </Link>
                                            <p className="card-text text-secondary small text-truncate-2 mb-3">{p.description}</p>
                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <span className="fs-5 fw-bold text-dark">{p.price.toLocaleString('vi-VN')} ₫</span>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-transparent border-0 p-3 pt-0">
                                            <div className="d-flex gap-2 w-100">
                                                <Link to={`/product/${p.id}`} className="btn-premium d-flex align-items-center justify-content-center text-decoration-none py-2" style={{flex: '6'}}>
                                                    XEM CHI TIẾT
                                                </Link>
                                                <button 
                                                    onClick={() => handleBuyNow(p)} 
                                                    disabled={p.stockQuantity <= 0}
                                                    className="btn-buy-now d-flex align-items-center justify-content-center py-2 text-uppercase fw-bold shadow-sm" style={{flex: '4', fontFamily: 'Oswald', letterSpacing: '0.5px'}}>
                                                    MUA NGAY
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )})}
                        </div>

                        {totalPages > 1 && (
                            <nav className="d-flex justify-content-center mt-5">
                                <ul className="pagination pagination-dark gap-2">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link rounded-0 border-dark text-dark" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                            <button 
                                                className={`page-link rounded-0 border-dark ${currentPage === index + 1 ? 'bg-dark text-white' : 'text-dark'}`}
                                                onClick={() => setCurrentPage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link rounded-0 border-dark text-dark" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default ProductsPage;
