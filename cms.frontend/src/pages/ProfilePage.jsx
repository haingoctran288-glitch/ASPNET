import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';

const ProfilePage = () => {
    const navigate = useNavigate();
    const customer = JSON.parse(localStorage.getItem('customer'));

    const [formData, setFormData] = useState({
        id: customer?.id || '',
        fullName: customer?.fullName || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: customer?.address || ''
    });

    useEffect(() => {
        if (!customer) navigate('/login');
    }, [customer, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.put('/CustomerApi/profile', {
                id: formData.id,
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address
            });
            localStorage.setItem('customer', JSON.stringify(res.data));
            alert('Cập nhật hồ sơ thành công!');
        } catch(err) {
            alert('Lỗi cập nhật: ' + err.message);
        }
    };

    if (!customer) return null;

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>HỒ SƠ CÁ NHÂN</h1>
            </div>
            <div className="container mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="card border-0 rounded-0 bg-light p-5 text-center shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${customer.fullName}&background=e3000f&color=fff&rounded=true&size=120`} alt="Avatar" className="mb-4 shadow-sm mx-auto" style={{borderRadius: '50%'}} />
                            <h3 className="brand-font mb-4">THÔNG TIN CỦA BẠN</h3>
                            <form onSubmit={handleSave} className="text-start">
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>HỌ VÀ TÊN</label>
                                    <input type="text" className="form-control rounded-0 border-0 shadow-sm p-3" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>EMAIL (KHÔNG THỂ ĐỔI)</label>
                                    <input type="email" className="form-control rounded-0 border-0 shadow-sm p-3 text-muted" value={formData.email} disabled />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>SỐ ĐIỆN THOẠI</label>
                                    <input type="tel" className="form-control rounded-0 border-0 shadow-sm p-3" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>ĐỊA CHỈ GIAO HÀNG MẶC ĐỊNH</label>
                                    <textarea className="form-control rounded-0 border-0 shadow-sm p-3" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                                </div>
                                <button type="submit" className="btn-premium w-100 py-3">LƯU THAY ĐỔI</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
export default ProfilePage;
