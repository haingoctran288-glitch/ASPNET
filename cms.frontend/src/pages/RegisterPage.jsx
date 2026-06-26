import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }
        try {
            await axiosClient.post('/CustomerApi/register', { 
                fullName: formData.fullName, 
                email: formData.email, 
                password: formData.password 
            });
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đăng ký');
        }
    };

    return (
        <MainLayout>
            <div className="container py-5 my-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card border-0 rounded-0 bg-light p-4 shadow-sm">
                            <div className="card-body">
                                <h2 className="text-center brand-font mb-4">ĐĂNG KÝ TÀI KHOẢN</h2>
                                {error && <div className="alert alert-danger rounded-0">{error}</div>}
                                <form onSubmit={handleRegister}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>HỌ VÀ TÊN</label>
                                        <input type="text" className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập họ tên..." value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>EMAIL</label>
                                        <input type="email" className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập email..." value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>MẬT KHẨU</label>
                                        <div className="input-group">
                                            <input type={showPassword ? "text" : "password"} className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập mật khẩu..." value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                                            <button type="button" className="btn btn-light bg-white border-0 shadow-sm rounded-0 px-3" onClick={() => setShowPassword(!showPassword)}>
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>XÁC NHẬN MẬT KHẨU</label>
                                        <div className="input-group">
                                            <input type={showConfirmPassword ? "text" : "password"} className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập lại mật khẩu..." value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                                            <button type="button" className="btn btn-light bg-white border-0 shadow-sm rounded-0 px-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-premium w-100 btn-lg mb-4">
                                        TẠO TÀI KHOẢN <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                    <div className="text-center mt-3">
                                        <span className="text-muted">Đã có tài khoản? </span>
                                        <Link to="/login" className="text-accent fw-bold text-decoration-none">Đăng nhập</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
export default RegisterPage;
