import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
    const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('selectedItems')) || [];
        // Only keep selected items that are actually in the cart
        const validSelected = saved.filter(id => cart.some(item => item.id === id));
        setSelectedItems(validSelected);
    }, [cart]);

    const handleSelect = (cartItemId) => {
        setSelectedItems(prev => {
            const newSelected = prev.includes(cartItemId) ? prev.filter(i => i !== cartItemId) : [...prev, cartItemId];
            localStorage.setItem('selectedItems', JSON.stringify(newSelected));
            return newSelected;
        });
    };

    const handleSelectAll = () => {
        if(selectedItems.length === cart.length) {
            setSelectedItems([]);
            localStorage.setItem('selectedItems', JSON.stringify([]));
        } else {
            const allIds = cart.map(i => i.cartItemId);
            setSelectedItems(allIds);
            localStorage.setItem('selectedItems', JSON.stringify(allIds));
        }
    };

    const selectedCartItems = cart.filter(item => selectedItems.includes(item.cartItemId));
    const total = selectedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleProceedToCheckout = () => {
        if(selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
            return;
        }
        navigate('/checkout');
    };

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>GIỎ HÀNG CỦA BẠN</h1>
            </div>
            <div className="container mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => window.history.back()} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                
                {cart.length === 0 ? (
                    <div className="text-center bg-glass p-5 rounded-4 shadow-soft">
                        <i className="fas fa-shopping-basket fa-5x text-muted mb-4 opacity-50"></i>
                        <h4 className="text-secondary fw-bold">Giỏ hàng đang trống!</h4>
                        <p className="mb-4">Hãy dạo quanh cửa hàng và chọn cho mình những sản phẩm tuyệt vời nhé.</p>
                        <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm btn-glow">Mua sắm ngay</Link>
                    </div>
                ) : (
                    <div className="row g-5">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-soft rounded-4 overflow-hidden bg-glass">
                                <div className="card-header bg-white border-bottom-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0">
                                        <div className="form-check d-inline-block me-2">
                                            <input className="form-check-input fs-5" type="checkbox" checked={selectedItems.length === cart.length && cart.length > 0} onChange={handleSelectAll} style={{cursor: 'pointer'}} />
                                        </div>
                                        Tất cả ({cart.length} sản phẩm)
                                    </h5>
                                </div>
                                <div className="card-body p-0">
                                    {cart.map((item, index) => {
                                        const imgUrl = item.imageUrl ? (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http') ? item.imageUrl : '/' + item.imageUrl) : "https://via.placeholder.com/150";
                                        const fullImg = imgUrl.startsWith('http') ? imgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${imgUrl}`;
                                        
                                        return (
                                        <div key={item.cartItemId} className={`d-flex align-items-center p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                                            <div className="form-check me-3">
                                                <input className="form-check-input fs-5" type="checkbox" checked={selectedItems.includes(item.cartItemId)} onChange={() => handleSelect(item.cartItemId)} style={{cursor: 'pointer'}} />
                                            </div>
                                            <img src={fullImg} alt={item.name} className="rounded-3 shadow-sm" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                                            <div className="ms-4 flex-grow-1">
                                                <Link to={`/product/${item.id}`} className="text-decoration-none"><h5 className="fw-bold text-dark mb-1">{item.name}</h5></Link>
                                                <p className="text-muted small mb-1">{item.price.toLocaleString('vi-VN')} đ</p>
                                                {item.selectedSize && <span className="badge bg-dark rounded-0 px-2 py-1">Size: {item.selectedSize}</span>}
                                            </div>
                                            <div className="d-flex align-items-center mx-4 bg-light rounded-pill px-2 py-1 shadow-sm border">
                                                <button className="btn btn-sm btn-link text-dark text-decoration-none" onClick={() => updateQuantity(item.cartItemId, -1)}><i className="fas fa-minus"></i></button>
                                                <span className="fw-bold px-3">{item.quantity}</span>
                                                <button className="btn btn-sm btn-link text-dark text-decoration-none" onClick={() => updateQuantity(item.cartItemId, 1)}><i className="fas fa-plus"></i></button>
                                            </div>
                                            <div className="text-end" style={{minWidth: '120px'}}>
                                                <h6 className="fw-bold text-gradient mb-0">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</h6>
                                            </div>
                                            <button className="btn btn-link text-danger ms-3" onClick={() => removeFromCart(item.cartItemId)}>
                                                <i className="fas fa-trash-alt fs-5"></i>
                                            </button>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-soft rounded-4 bg-gradient-primary text-white position-sticky" style={{top: '100px'}}>
                                <div className="card-body p-4 p-xl-5">
                                    <h4 className="fw-bold mb-4">Tóm tắt đơn hàng</h4>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                                        <span className="fw-semibold">{total.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-4">
                                        <span>Phí vận chuyển</span>
                                        <span className="fw-semibold text-warning">{selectedItems.length > 0 ? 'Miễn phí' : '0 đ'}</span>
                                    </div>
                                    <hr className="border-light opacity-25 mb-4" />
                                    <div className="d-flex justify-content-between mb-5 align-items-center">
                                        <span className="fs-5">Tổng cộng</span>
                                        <span className="fs-3 fw-bolder">{total.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                    <button onClick={handleProceedToCheckout} className={`btn ${selectedItems.length > 0 ? 'btn-light text-primary hover-scale shadow-lg' : 'btn-secondary text-white opacity-50'} w-100 btn-lg rounded-pill fw-bold`}>
                                        Tiến hành thanh toán <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
export default CartPage;
