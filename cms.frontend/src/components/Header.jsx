import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Header = () => {
    const navigate = useNavigate();
    const [prodCats, setProdCats] = useState([]);
    const [postCats, setPostCats] = useState([]);
    
    // Auth state
    const customer = JSON.parse(localStorage.getItem('customer'));
    const { cart } = useContext(CartContext);

    useEffect(() => {
        axiosClient.get('/CategoryProductApi').then(res => setProdCats(res.data)).catch(console.error);
        axiosClient.get('/CategoryApi').then(res => setPostCats(res.data)).catch(console.error);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('customer');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm px-4" style={{borderBottom: '1px solid #eee'}}>
            <div className="container-fluid">
                <Link className="navbar-brand brand-font fs-2 text-dark d-flex align-items-center" to="/">
                    <i className="fas fa-futbol me-2"></i>HAI SPORT
                </Link>
                
                <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav gap-2 gap-lg-4">
                        <li className="nav-item">
                            <Link className="nav-link text-dark fw-bold text-uppercase" to="/" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>Trang chủ</Link>
                        </li>
                        
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-dark fw-bold text-uppercase" to="/products" id="productDropdown" role="button" data-bs-toggle="dropdown" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>
                                Sản phẩm
                            </Link>
                            <ul className="dropdown-menu border-0 shadow-sm rounded-0 mt-2">
                                <li><Link className="dropdown-item py-2 fw-semibold" to="/products" style={{fontFamily: 'Oswald', textTransform: 'uppercase'}}>Tất cả sản phẩm</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                {prodCats.map(c => (
                                    <li key={c.id}><Link className="dropdown-item py-2" to={`/products?category=${c.id}`}>{c.name}</Link></li>
                                ))}
                            </ul>
                        </li>

                        <li className="nav-item dropdown">
                            <span className="nav-link dropdown-toggle text-dark fw-bold text-uppercase" id="postDropdown" role="button" data-bs-toggle="dropdown" style={{cursor: 'pointer', fontFamily: 'Oswald', letterSpacing: '1px'}}>
                                Bài viết
                            </span>
                            <ul className="dropdown-menu border-0 shadow-sm rounded-0 mt-2">
                                <li><Link className="dropdown-item py-2 fw-semibold" to="/posts" style={{fontFamily: 'Oswald', textTransform: 'uppercase'}}>Tất cả bài viết</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                {postCats.map(c => (
                                    <li key={c.id}><Link className="dropdown-item py-2" to={`/posts?category=${c.id}`}>{c.name}</Link></li>
                                ))}
                            </ul>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link text-dark fw-bold text-uppercase" to="/contact" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>Liên hệ</Link>
                        </li>
                    </ul>
                </div>

                <div className="d-flex gap-4 align-items-center mt-3 mt-lg-0">
                    <Link to="/cart" className="text-dark text-decoration-none position-relative">
                        <i className="fas fa-shopping-cart fs-5"></i>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-accent" style={{fontSize: '0.65rem', border: '1px solid #fff'}}>{cart.length}</span>
                    </Link>
                    
                    {customer ? (
                        <div className="dropdown">
                            <span className="text-dark text-decoration-none fw-bold dropdown-toggle d-flex align-items-center gap-2" role="button" data-bs-toggle="dropdown" style={{cursor: 'pointer', fontFamily: 'Oswald', letterSpacing: '0.5px'}}>
                                <img src={`https://ui-avatars.com/api/?name=${customer.fullName}&background=111&color=fff`} width="30" alt="Avatar" className="rounded-circle"/>
                                {customer.fullName.toUpperCase()}
                            </span>
                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-0 mt-3" style={{right: 0, left: "auto"}}>
                                <li><Link className="dropdown-item py-2" to="/profile"><i className="fas fa-user-circle me-2"></i>Hồ sơ cá nhân</Link></li>
                                <li><Link className="dropdown-item py-2" to="/orders"><i className="fas fa-box me-2"></i>Lịch sử đặt hàng</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger py-2 fw-bold" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i>Đăng xuất</button></li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-premium text-decoration-none">
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
