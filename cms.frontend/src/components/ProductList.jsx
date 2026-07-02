import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CartContext } from '../context/CartContext';
const ProductList = ({ title, endpoint }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    
    // Generate a unique ID for the modal to prevent conflicts when multiple ProductList exist
    const modalId = `quickBuyModal-${title.replace(/\s+/g, '')}`;
    
    // Quick buy modal state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    
    const openBuyModal = (p) => {
        setSelectedProduct(p);
        if (p.sizes) {
            setSelectedSize(p.sizes.split(',')[0].trim());
        }
        setQuantity(1);
        
        // Show modal using Bootstrap API
        setTimeout(() => {
            const modalEl = document.getElementById(modalId);
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
            const newItem = { ...p, quantity: quantity, selectedSize: selectedSize, cartItemId };
            currentCart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
        } else {
            cartItemId = existing.cartItemId;
            existing.quantity += quantity;
            localStorage.setItem('cart', JSON.stringify(currentCart));
        }
        
        localStorage.setItem('selectedItems', JSON.stringify([cartItemId]));
        
        // Hide modal
        const modalEl = document.getElementById(modalId);
        if (modalEl && window.bootstrap) {
            const modal = window.bootstrap.Modal.getInstance(modalEl);
            if(modal) modal.hide();
        }
        
        window.location.href = '/checkout';
    };

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
                    const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "/logo512.png";
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${imgUrl}`;
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
            
            {/* Quick Buy Modal */}
            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-dark text-white border-0">
                            <h5 className="modal-title brand-font text-uppercase" id={`${modalId}Label`}>
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
        </div>
    );
};

export default ProductList;
