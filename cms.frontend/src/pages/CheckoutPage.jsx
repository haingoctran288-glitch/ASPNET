import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { CartContext } from '../context/CartContext';
import axiosClient from '../api/axiosClient';

const CheckoutPage = () => {
    const { cart, setCart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const customer = JSON.parse(localStorage.getItem('customer'));
    const selectedItemIds = JSON.parse(localStorage.getItem('selectedItems')) || [];
    const checkoutItems = cart.filter(item => selectedItemIds.includes(item.cartItemId));
    
    const [formData, setFormData] = useState({
        fullName: customer?.fullName || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        address: customer?.address || '',
        notes: ''
    });

    useEffect(() => {
        if (!customer) navigate('/login');
        if (checkoutItems.length === 0) navigate('/cart');
    }, [customer?.id, checkoutItems.length, navigate]);

    const total = checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleOrder = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const reqData = {
                customerId: customer.id,
                notes: `SĐT: ${formData.phone}, Địa chỉ: ${formData.address}, Ghi chú: ${formData.notes}`,
                items: checkoutItems.map(i => ({ productId: i.id, quantity: i.quantity, unitPrice: i.price, size: i.selectedSize }))
            };
            const response = await axiosClient.post('/OrderApi/checkout', reqData);
            
            // Lọc các item ĐÃ mua ra khỏi giỏ
            const remainingCart = cart.filter(item => !selectedItemIds.includes(item.cartItemId));
            setCart(remainingCart);
            localStorage.removeItem('selectedItems');
            
            navigate(`/order-success?id=${response.data.orderId}`);
        } catch (err) {
            alert('Lỗi khi đặt hàng: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    if (!customer || cart.length === 0) return null;

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>THANH TOÁN</h1>
            </div>
            <div className="container mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                
                <div className="row g-5">
                    <div className="col-lg-7">
                        <div className="card border-0 rounded-0 bg-light p-4 p-xl-5 shadow-sm">
                            <h4 className="fw-bold mb-4">Thông tin giao hàng</h4>
                            <form onSubmit={handleOrder}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Họ và tên</label>
                                    <input type="text" className="form-control rounded-pill bg-light" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Số điện thoại</label>
                                        <input type="tel" className="form-control rounded-pill bg-light" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input type="email" className="form-control rounded-pill bg-light" value={formData.email} disabled />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Địa chỉ giao hàng</label>
                                    <input type="text" className="form-control rounded-pill bg-light" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Ghi chú đơn hàng</label>
                                    <textarea className="form-control rounded-4 bg-light" rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                                </div>
                                
                                <h4 className="fw-bold mb-3 mt-4">Phương thức thanh toán</h4>
                                <div className="card border-primary shadow-sm rounded-4 mb-4 bg-light">
                                    <div className="card-body">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" checked readOnly />
                                            <label className="form-check-label fw-bold">Thanh toán tiền mặt khi nhận hàng (COD)</label>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-lg btn-glow" disabled={isLoading}>
                                    {isLoading ? (
                                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang xử lý...</>
                                    ) : (
                                        "Xác nhận đặt hàng"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    <div className="col-lg-5">
                        <div className="card shadow-soft border-0 rounded-4 bg-light">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Đơn hàng của bạn</h4>
                                <div className="d-flex flex-column gap-3 mb-4">
                                    {checkoutItems.map(item => {
                                        const imgUrl = item.imageUrl ? (item.imageUrl.startsWith('/') || item.imageUrl.startsWith('http') ? item.imageUrl : '/' + item.imageUrl) : "/logo512.png";
                                        const fullImg = imgUrl.startsWith('http') ? imgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${imgUrl}`;
                                        return (
                                        <div key={item.cartItemId} className="d-flex align-items-center">
                                            <div className="position-relative">
                                                <img src={fullImg} alt={item.name} className="rounded-3 shadow-sm border" style={{width: '60px', height: '60px', objectFit: 'cover'}} />
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">{item.quantity}</span>
                                            </div>
                                            <div className="ms-3 flex-grow-1">
                                                <h6 className="fw-bold mb-0 text-truncate" style={{maxWidth: '180px'}}>{item.name}</h6>
                                                {item.selectedSize && <small className="text-muted d-block mt-1">Size: {item.selectedSize}</small>}
                                            </div>
                                            <div className="fw-semibold">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</div>
                                        </div>
                                    )})}
                                </div>
                                <hr className="opacity-25" />
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tạm tính</span>
                                    <span className="fw-semibold">{total.toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-muted">Phí vận chuyển</span>
                                    <span className="fw-semibold text-warning">Miễn phí</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                                    <span className="fs-5 fw-bold">Tổng cộng</span>
                                    <span className="fs-3 fw-bolder text-gradient">{total.toLocaleString('vi-VN')} đ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
export default CheckoutPage;
