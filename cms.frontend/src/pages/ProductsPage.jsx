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
    
    // Quick buy modal state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    // Parse query parameter
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    const search = queryParams.get('search');

    const [minPrice, setMinPrice] = useState(queryParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(queryParams.get('maxPrice') || '');

    const openBuyModal = (p) => {
        setSelectedProduct(p);
        if (p.sizes) {
            setSelectedSize(p.sizes.split(',')[0].trim());
        }
        setQuantity(1);
        
        setTimeout(() => {
            const modalEl = document.getElementById('productsQuickBuyModal');
            if (modalEl && window.bootstrap) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
            }
        }, 50);
    };

    const handleConfirmBuy = () => {
        if(!selectedProduct) return;
        const p = selectedProduct;
        
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = currentCart.find(i => i.id === p.id && i.selectedSize === selectedSize);
        let cartItemId = Date.now().toString();
        
        if(!existing) {
            if (quantity > p.stockQuantity) {
                alert("Số lượng sản phẩm trong kho không đủ!");
                return;
            }
            const newItem = { ...p, quantity: quantity, selectedSize: selectedSize, cartItemId };
            currentCart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
        } else {
            if (existing.quantity + quantity > p.stockQuantity) {
                alert("Số lượng sản phẩm trong kho không đủ!");
                return;
            }
            cartItemId = existing.cartItemId;
            existing.quantity += quantity;
            localStorage.setItem('cart', JSON.stringify(currentCart));
        }
        
        localStorage.setItem('selectedItems', JSON.stringify([cartItemId]));
        
        const modalEl = document.getElementById('productsQuickBuyModal');
        if (modalEl && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();
        }
        
        window.location.href = '/checkout';
    };

    useEffect(() => {
        setLoading(true);
        let url = '/ProductApi?';
        if (categoryId) url += `categoryId=${categoryId}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (minPrice) url += `minPrice=${minPrice}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;
        
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
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${imgUrl}`;
                    setBannerUrl(fullImg);
                }
            })
            .catch(err => console.error(err));
    }, [categoryId, search, location.search, minPrice, maxPrice]);

    const handleFilterPrice = (e) => {
        e.preventDefault();
        let query = new URLSearchParams(location.search);
        if (minPrice) query.set('minPrice', minPrice);
        else query.delete('minPrice');
        if (maxPrice) query.set('maxPrice', maxPrice);
        else query.delete('maxPrice');
        navigate(`/products?${query.toString()}`);
    };

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
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                            <h4 className="mb-0 text-uppercase fw-bold brand-font">
                                {search ? `Kết quả tìm kiếm: "${search}"` : "Tất cả sản phẩm"}
                            </h4>
                            <form onSubmit={handleFilterPrice} className="d-flex gap-2 align-items-center">
                                <span className="fw-bold text-muted small">LỌC GIÁ:</span>
                                <input type="number" className="form-control form-control-sm rounded-0" placeholder="Từ" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{width: '100px'}} />
                                <span>-</span>
                                <input type="number" className="form-control form-control-sm rounded-0" placeholder="Đến" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{width: '100px'}} />
                                <button type="submit" className="btn btn-dark btn-sm rounded-0 fw-bold">LỌC</button>
                            </form>
                        </div>
                        {currentProducts.length === 0 ? (
                            <div className="text-center py-5">
                                <img src="/no-results.png" alt="No results" style={{maxWidth: '200px', opacity: 0.5, marginBottom: '20px'}} />
                                <h4 className="text-muted">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn</h4>
                            </div>
                        ) : (
                        <div className="row g-4 justify-content-center">
                            {currentProducts.map(p => {
                                const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "/logo512.png";
                                const fullImg = imgUrl.startsWith('http') ? imgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${imgUrl}`;
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
                                                    onClick={() => openBuyModal(p)} 
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
                        )}

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

            {/* Quick Buy Modal for ProductsPage */}
            <div className="modal fade" id="productsQuickBuyModal" tabIndex="-1" aria-labelledby="productsQuickBuyModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-dark text-white border-0">
                            <h5 className="modal-title brand-font text-uppercase" id="productsQuickBuyModalLabel">
                                {selectedProduct?.name}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="d-flex mb-4">
                                <img 
                                    src={selectedProduct?.imageUrl ? (selectedProduct.imageUrl.startsWith('http') ? selectedProduct.imageUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${selectedProduct.imageUrl}`) : "/logo512.png"} 
                                    alt={selectedProduct?.name} 
                                    className="rounded" 
                                    style={{width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #eee'}} 
                                />
                                <div className="ms-3">
                                    <h4 className="fw-bold text-danger mb-2">{(selectedProduct?.price || 0).toLocaleString('vi-VN')} ₫</h4>
                                    <p className="text-muted small mb-0"><i className="fas fa-box me-1"></i> Còn {selectedProduct?.stockQuantity} sản phẩm</p>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="fw-bold mb-2">CHỌN SIZE:</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {selectedProduct?.sizes ? selectedProduct.sizes.split(',').map((size, idx) => {
                                        const s = size.trim();
                                        return (
                                            <button 
                                                key={idx}
                                                type="button" 
                                                className={`btn ${selectedSize === s ? 'btn-dark' : 'btn-outline-dark'} rounded-0 px-3 py-2 fw-bold`}
                                                onClick={() => setSelectedSize(s)}
                                            >
                                                {s}
                                            </button>
                                        );
                                    }) : (
                                        <span className="text-muted">Không có thông tin size</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="fw-bold mb-2">SỐ LƯỢNG:</label>
                                <div className="d-flex align-items-center" style={{width: '140px'}}>
                                    <button className="btn btn-outline-dark rounded-0 px-3" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <input type="text" className="form-control text-center rounded-0 border-dark border-start-0 border-end-0 fw-bold" value={quantity} readOnly />
                                    <button className="btn btn-outline-dark rounded-0 px-3" onClick={() => setQuantity(Math.min(selectedProduct?.stockQuantity || 1, quantity + 1))}>+</button>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light p-3">
                            <button type="button" className="btn btn-outline-secondary px-4 fw-bold rounded-pill" data-bs-dismiss="modal">Hủy</button>
                            <button type="button" className="btn btn-danger px-4 fw-bold text-uppercase rounded-pill" onClick={handleConfirmBuy}>
                                MUA NGAY <i className="fas fa-shopping-bag ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductsPage;
