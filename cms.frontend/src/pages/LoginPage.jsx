import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosClient.post('/CustomerApi/login', { email, password });
            localStorage.setItem('customer', JSON.stringify(res.data));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đăng nhập');
        }
    };

    return (
        <MainLayout>
            <div className="container py-5 my-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card border-0 rounded-0 bg-light p-4 shadow-sm">
                            <div className="card-body">
                                <h2 className="text-center brand-font mb-4">ĐĂNG NHẬP</h2>
                                {error && <div className="alert alert-danger rounded-0">{error}</div>}
                                <form onSubmit={handleLogin}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>EMAIL CỦA BẠN</label>
                                        <input type="email" className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập email..." value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>MẬT KHẨU</label>
                                        <div className="input-group">
                                            <input type={showPassword ? "text" : "password"} className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập mật khẩu..." value={password} onChange={e => setPassword(e.target.value)} required />
                                            <button type="button" className="btn btn-light bg-white border-0 shadow-sm rounded-0 px-3" onClick={() => setShowPassword(!showPassword)}>
                                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-premium w-100 btn-lg mb-4">
                                        ĐĂNG NHẬP <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                    <div className="text-center mt-3">
                                        <span className="text-muted">Chưa có tài khoản? </span>
                                        <Link to="/register" className="text-accent fw-bold text-decoration-none">Đăng ký ngay</Link>
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
export default LoginPage;
