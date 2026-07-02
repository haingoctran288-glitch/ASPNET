import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [resendCount, setResendCount] = useState(0);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setSuccessMsg('');
        
        try {
            const res = await axiosClient.post('/CustomerApi/forgot-password', { email });
            setSuccessMsg(res.data.message);
            setTimeLeft(res.data.expirySeconds || 120);
            setResendCount(res.data.resendCount);
            setIsLocked(false);
            setStep(2);
        } catch (err) {
            if (err.response?.status === 429) {
                setIsLocked(true);
            }
            setError(err.response?.data?.message || 'Lỗi gửi yêu cầu');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axiosClient.post('/CustomerApi/verify-otp', { email, otp });
            setSuccessMsg(res.data.message);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không hợp lệ');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Mật khẩu phải từ 6 ký tự trở lên.');
            return;
        }

        try {
            const res = await axiosClient.post('/CustomerApi/reset-password', { email, otp, newPassword });
            setSuccessMsg(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi đổi mật khẩu');
        }
    };

    return (
        <MainLayout>
            <div className="container py-5 my-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card border-0 rounded-0 bg-light p-4 shadow-sm">
                            <div className="card-body">
                                <h2 className="text-center brand-font mb-4">QUÊN MẬT KHẨU</h2>
                                {error && <div className="alert alert-danger rounded-0">{error}</div>}
                                {successMsg && <div className="alert alert-success rounded-0">{successMsg}</div>}
                                
                                {step === 1 && (
                                    <form onSubmit={handleSendOtp}>
                                        <p className="text-muted text-center mb-4">
                                            Nhập email của bạn để nhận mã xác thực (OTP).
                                        </p>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>EMAIL CỦA BẠN</label>
                                            <input type="email" className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập email..." value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn-premium w-100 btn-lg mb-4">
                                            GỬI MÃ OTP <i className="fas fa-paper-plane ms-2"></i>
                                        </button>
                                        <div className="text-center mt-3">
                                            <Link to="/login" className="text-accent fw-bold text-decoration-none">Quay lại đăng nhập</Link>
                                        </div>
                                    </form>
                                )}

                                {step === 2 && (
                                    <form onSubmit={handleVerifyOtp}>
                                        <p className="text-muted text-center mb-4">
                                            Mã OTP đã được gửi đến <strong>{email}</strong>
                                        </p>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>NHẬP MÃ OTP</label>
                                            <input type="text" className="form-control form-control-lg rounded-0 border-0 shadow-sm text-center fw-bold" placeholder="------" maxLength="6" value={otp} onChange={e => setOtp(e.target.value)} required />
                                        </div>
                                        
                                        <button type="submit" className="btn-premium w-100 btn-lg mb-3">
                                            XÁC NHẬN OTP <i className="fas fa-check ms-2"></i>
                                        </button>
                                        
                                        <div className="text-center mt-3">
                                            {timeLeft > 0 ? (
                                                <span className="text-muted">Vui lòng chờ <strong className="text-danger">{timeLeft}s</strong> để gửi lại.</span>
                                            ) : (
                                                <button type="button" onClick={handleSendOtp} disabled={isLocked} className={`btn btn-link text-decoration-none fw-bold ${isLocked ? 'text-muted' : 'text-accent'}`}>
                                                    Gửi lại OTP (Đã gửi {resendCount}/3 lần)
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                )}

                                {step === 3 && (
                                    <form onSubmit={handleResetPassword}>
                                        <p className="text-success fw-bold text-center mb-4">
                                            <i className="fas fa-check-circle me-1"></i> Xác thực thành công. Vui lòng tạo mật khẩu mới.
                                        </p>
                                        <div className="mb-3">
                                            <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>MẬT KHẨU MỚI</label>
                                            <input type="password" className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Mật khẩu mới..." value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-bold" style={{fontFamily: 'Oswald'}}>XÁC NHẬN MẬT KHẨU</label>
                                            <input type="password" className="form-control form-control-lg rounded-0 border-0 shadow-sm" placeholder="Nhập lại mật khẩu..." value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn-premium w-100 btn-lg mb-4">
                                            ĐỔI MẬT KHẨU <i className="fas fa-save ms-2"></i>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ForgotPasswordPage;
