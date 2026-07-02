import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);
    const firstItem = order.details[0];
    const moreCount = order.details.length - 1;
    const imgUrl = firstItem?.imageUrl ? (firstItem.imageUrl.startsWith('/') || firstItem.imageUrl.startsWith('http') ? firstItem.imageUrl : '/' + firstItem.imageUrl) : "/logo512.png";
    const fullImg = imgUrl.startsWith('http') ? imgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${imgUrl}`;

    const getStatusBadge = (status) => {
        if(status === 0) return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm"><i className="fas fa-hourglass-half me-1"></i>Chờ duyệt</span>;
        if(status === 1) return <span className="badge bg-primary px-3 py-2 rounded-pill shadow-sm"><i className="fas fa-shipping-fast me-1"></i>Đang giao</span>;
        if(status === 2) return <span className="badge bg-success px-3 py-2 rounded-pill shadow-sm"><i className="fas fa-check-circle me-1"></i>Đã giao</span>;
        return <span className="badge bg-secondary px-3 py-2 rounded-pill shadow-sm">Chưa rõ</span>;
    };

    return (
        <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden" style={{transition: 'all 0.3s'}}>
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex flex-wrap justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <span className="fw-bolder text-dark fs-5">Mã đơn: #{order.id}</span>
                    <span className="text-muted small border-start ps-3"><i className="far fa-clock me-1"></i> {new Date(order.orderDate).toLocaleString('vi-VN')}</span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
            </div>
            <div className="card-body p-0">
                <div className="p-4 d-flex align-items-center bg-light">
                    <img src={fullImg} alt={firstItem.name} className="rounded-3 shadow-sm bg-white" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                    <div className="ms-3 flex-grow-1">
                        <h6 className="fw-bold mb-1 text-dark fs-5">{firstItem.name}</h6>
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted fw-semibold">x{firstItem.quantity}</span>
                            {firstItem.size && <span className="badge bg-dark rounded-0 px-2 py-1">Size: {firstItem.size}</span>}
                        </div>
                    </div>
                    <div className="fw-bold text-end">
                        <span className="d-block text-muted small">Đơn giá</span>
                        <span className="fs-6">{(firstItem.unitPrice).toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
                
                {expanded && (
                    <div className="bg-white">
                        <div className="p-4 border-top">
                            <h6 className="fw-bold mb-3 text-secondary">CHI TIẾT SẢN PHẨM:</h6>
                            <div className="d-flex flex-column gap-3">
                                {order.details.map((d, i) => {
                                    const dImgUrl = d.imageUrl ? (d.imageUrl.startsWith('/') || d.imageUrl.startsWith('http') ? d.imageUrl : '/' + d.imageUrl) : "/logo512.png";
                                    const dFullImg = dImgUrl.startsWith('http') ? dImgUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${dImgUrl}`;
                                    return (
                                    <div key={i} className="d-flex align-items-center">
                                        <img src={dFullImg} alt={d.name} className="rounded-3 border" style={{width: '60px', height: '60px', objectFit: 'cover'}} />
                                        <div className="ms-3 flex-grow-1">
                                            <h6 className="fw-semibold mb-1 text-dark">{d.name}</h6>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="text-muted small">x{d.quantity}</span>
                                                {d.size && <span className="badge bg-dark rounded-0 px-2 py-1" style={{fontSize: '0.75rem'}}>Size: {d.size}</span>}
                                            </div>
                                        </div>
                                        <div className="fw-bold text-secondary">{(d.unitPrice * d.quantity).toLocaleString('vi-VN')} đ</div>
                                    </div>
                                )})}
                            </div>
                            <div className="mt-4 p-3 bg-light rounded-3 text-muted small border">
                                <i className="fas fa-comment-dots me-2"></i><strong>Ghi chú:</strong> {order.notes || 'Không có ghi chú.'}
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 bg-white border-top d-flex flex-wrap justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        {moreCount > 0 && <span className="text-muted small bg-light px-3 py-1 rounded-pill">+{moreCount} sản phẩm khác</span>}
                        <button className="btn btn-link text-primary text-decoration-none fw-bold p-0 d-flex align-items-center gap-2" onClick={() => setExpanded(!expanded)}>
                            <span>{expanded ? 'Thu gọn' : 'Xem chi tiết'}</span> <i className={`fas fa-chevron-${expanded ? 'up' : 'down'}`}></i>
                        </button>
                    </div>
                    <div className="text-end mt-3 mt-md-0">
                        <span className="text-muted d-inline-block me-3">Thành tiền:</span>
                        <span className="fw-bolder text-gradient fs-3">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrdersPage = () => {
    const navigate = useNavigate();
    const customer = JSON.parse(localStorage.getItem('customer'));
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customer) {
            navigate('/login');
            return;
        }
        axiosClient.get(`/OrderApi/customer/${customer.id}`)
            .then(res => { setOrders(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [customer, navigate]);

    if (loading) return <MainLayout><div className="text-center py-5"><div className="spinner-border text-primary"></div></div></MainLayout>;

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>LỊCH SỬ MUA HÀNG</h1>
            </div>
            <div className="container mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                
                {orders.length === 0 ? (
                    <div className="text-center bg-glass p-5 rounded-4 shadow-soft">
                        <i className="fas fa-box-open fa-4x text-muted mb-4 opacity-50"></i>
                        <h4 className="text-secondary fw-bold">Chưa có đơn hàng nào!</h4>
                        <p className="mb-0">Bạn chưa mua bất kỳ sản phẩm nào từ chúng tôi.</p>
                    </div>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            {orders.map(order => <OrderCard key={order.id} order={order} />)}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
export default OrdersPage;
