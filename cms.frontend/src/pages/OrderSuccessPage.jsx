import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const OrderSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('id');

    return (
        <MainLayout>
            <div className="container py-5 my-5 text-center">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0 rounded-4 p-5 bg-white">
                            <div className="mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle shadow" style={{ width: '100px', height: '100px' }}>
                                    <i className="fas fa-check-circle fa-4x"></i>
                                </div>
                            </div>
                            <h2 className="fw-bolder text-dark mb-3">ĐẶT HÀNG THÀNH CÔNG!</h2>
                            <p className="text-muted fs-5 mb-4">
                                Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>Hai Sport</strong>. 
                                Đơn hàng của bạn đã được hệ thống ghi nhận và đang chờ xử lý.
                            </p>
                            {orderId && (
                                <div className="bg-light rounded-3 p-3 mb-4 mx-auto" style={{ maxWidth: '300px' }}>
                                    <span className="text-muted d-block mb-1">Mã đơn hàng của bạn:</span>
                                    <span className="fw-bold fs-4 text-primary">#{orderId}</span>
                                </div>
                            )}
                            <p className="text-secondary small mb-5">
                                Chúng tôi sẽ sớm liên hệ với bạn qua số điện thoại hoặc email để xác nhận đơn hàng.
                            </p>
                            
                            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                                <Link to="/orders" className="btn btn-outline-dark btn-lg px-4 rounded-pill fw-bold">
                                    <i className="fas fa-list-alt me-2"></i> Xem chi tiết đơn hàng
                                </Link>
                                <Link to="/" className="btn btn-primary btn-lg px-4 rounded-pill fw-bold shadow-sm btn-glow">
                                    <i className="fas fa-home me-2"></i> Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderSuccessPage;
