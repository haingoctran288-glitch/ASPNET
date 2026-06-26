import os

base_dir = r"c:\Users\NGOC HAI\Downloads\asp-net-buoi-2\cms.frontend\src"

dirs = ["components", "layouts", "pages", "api"]
for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

# 1. API Client
axios_client = """import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://localhost:7226/api', // Điền đúng port backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
"""
with open(os.path.join(base_dir, "api", "axiosClient.js"), "w", encoding="utf-8") as f:
    f.write(axios_client)

# 2. Components
# Header
header = """import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm glass-header">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3 text-gradient" to="/">
                    <i className="fas fa-gem me-2"></i>HAI STORE
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active fw-semibold" to="/">Trang chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="/products">Sản phẩm</Link>
                        </li>
                    </ul>
                    <div className="d-flex gap-3 align-items-center">
                        <Link to="/cart" className="text-white text-decoration-none position-relative">
                            <i className="fas fa-shopping-cart fs-5"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">0</span>
                        </Link>
                        <a href="https://localhost:7226/Account/Login" className="btn btn-outline-light rounded-pill px-4 fw-bold hover-glow">Đăng nhập CMS</a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
"""

# Footer
footer = """import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-5 pb-4 mt-5 shadow-lg">
            <div className="container text-center text-md-start">
                <div className="row">
                    <div className="col-md-4 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4 fs-4 text-gradient">
                            <i className="fas fa-gem me-2"></i>HAI STORE
                        </h6>
                        <p className="text-secondary">Trải nghiệm mua sắm công nghệ số đỉnh cao. Sản phẩm được đồng bộ realtime từ hệ thống CMS Backend.</p>
                    </div>
                    <div className="col-md-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Liên kết</h6>
                        <p><a href="#!" className="text-secondary text-decoration-none hover-white">Về chúng tôi</a></p>
                        <p><a href="#!" className="text-secondary text-decoration-none hover-white">Chính sách</a></p>
                    </div>
                    <div className="col-md-3 mx-auto mb-md-0 mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">Liên hệ</h6>
                        <p className="text-secondary"><i className="fas fa-home me-3"></i> TPHCM, VN</p>
                        <p className="text-secondary"><i className="fas fa-envelope me-3"></i> info@haistore.vn</p>
                    </div>
                </div>
            </div>
            <div className="text-center p-4 border-top border-secondary mt-3">
                © 2026 Copyright: <span className="fw-bold text-gradient">Trần Ngọc Hải</span>
            </div>
        </footer>
    );
};

export default Footer;
"""

# HeroBanner
hero = """import React from 'react';

const HeroBanner = () => {
    return (
        <div className="hero-banner text-white text-center py-5 mb-5 shadow-sm position-relative overflow-hidden">
            <div className="container py-5 position-relative z-index-1">
                <h1 className="display-3 fw-bolder mb-3 fade-in-up">Công nghệ <span className="text-gradient">Tương lai</span></h1>
                <p className="lead mb-4 fade-in-up delay-1">Khám phá các sản phẩm đỉnh cao với giao diện React hiện đại. Dữ liệu từ ASP.NET Core MVC Backend.</p>
                <a href="#products" className="btn btn-light text-primary btn-lg rounded-pill px-5 fw-bold shadow-lg hover-scale fade-in-up delay-2">
                    Khám phá ngay <i className="fas fa-arrow-down ms-2"></i>
                </a>
            </div>
            <div className="bg-shape shadow-1"></div>
            <div className="bg-shape shadow-2"></div>
        </div>
    );
};

export default HeroBanner;
"""

# ProductList
products = """import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get('/ProductApi')
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="mb-5" id="products">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <h3 className="fw-bold m-0 position-relative title-underline">Sản phẩm nổi bật</h3>
                <a href="#!" className="text-primary fw-bold text-decoration-none hover-glow">Xem tất cả <i className="fas fa-angle-right"></i></a>
            </div>
            <div className="row g-4">
                {products.slice(0, 6).map(p => {
                    const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "https://via.placeholder.com/400x300";
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `https://localhost:7226${imgUrl}`;
                    return (
                    <div className="col-md-6 col-lg-4" key={p.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-4 product-card overflow-hidden bg-glass">
                            <div className="img-wrapper overflow-hidden" style={{height: '220px'}}>
                                <img src={fullImg} className="card-img-top img-zoom" alt={p.name} style={{height: '100%', width: '100%', objectFit: 'cover'}} />
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                                <h5 className="card-title fw-bold text-dark">{p.name}</h5>
                                <p className="card-text text-secondary small text-truncate-2">{p.description}</p>
                                <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
                                    <span className="fs-5 fw-bolder text-gradient">{p.price.toLocaleString('vi-VN')} đ</span>
                                    <span className="badge bg-light text-dark border shadow-sm">Kho: {p.stockQuantity}</span>
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-0 p-3 pt-0">
                                <button className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm btn-glow">
                                    <i className="fas fa-cart-plus me-2"></i>Thêm giỏ hàng
                                </button>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default ProductList;
"""

# CategoryList
categories = """import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axiosClient.get('/CategoryProductApi').then(res => setCategories(res.data)).catch(err => console.log(err));
    }, []);

    return (
        <div className="card shadow-sm border-0 rounded-4 mb-4 bg-glass sticky-top" style={{top: '80px'}}>
            <div className="card-header bg-transparent border-0 pt-4 pb-2">
                <h5 className="fw-bold mb-0"><i className="fas fa-layer-group text-gradient me-2"></i>Danh mục SP</h5>
            </div>
            <div className="card-body p-2 pb-4">
                <ul className="list-group list-group-flush">
                    {categories.map(c => (
                        <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center border-0 bg-transparent mb-1 cat-item rounded-3">
                            <a href="#!" className="text-decoration-none fw-semibold text-dark w-100">{c.name}</a>
                            <i className="fas fa-chevron-right text-muted small"></i>
                        </li>
                    ))}
                    {categories.length === 0 && <p className="text-muted small px-3">Đang tải...</p>}
                </ul>
            </div>
        </div>
    );
};

export default CategoryList;
"""

# PostList
posts = """import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axiosClient.get('/PostApi').then(res => setPosts(res.data)).catch(err => console.log(err));
    }, []);

    if(posts.length === 0) return null;

    return (
        <div className="mt-5 pt-4 mb-5">
            <h3 className="fw-bold mb-4 text-center title-underline mx-auto" style={{maxWidth: '200px'}}>Tin tức mới</h3>
            <div className="row g-4 justify-content-center">
                {posts.slice(0, 3).map(p => {
                    const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "https://via.placeholder.com/400x250";
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `https://localhost:7226${imgUrl}`;
                    return (
                    <div className="col-md-4" key={p.id}>
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 blog-card bg-glass">
                            <div className="position-relative overflow-hidden">
                                <img src={fullImg} className="card-img-top img-zoom" alt={p.title} style={{height: '180px', objectFit: 'cover'}} />
                                <div className="position-absolute top-0 end-0 bg-primary text-white px-3 py-1 rounded-bl-3 shadow">Mới</div>
                            </div>
                            <div className="card-body p-4">
                                <small className="text-primary fw-bold mb-2 d-block"><i className="far fa-calendar-alt me-1"></i> {new Date(p.createdDate).toLocaleDateString('vi-VN')}</small>
                                <h5 className="card-title fw-bold mt-1 text-dark line-clamp-2" style={{lineHeight: '1.4'}}>{p.title}</h5>
                                <p className="card-text text-secondary small line-clamp-3 mt-2">{p.content}</p>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default PostList;
"""

with open(os.path.join(base_dir, "components", "Header.jsx"), "w", encoding="utf-8") as f: f.write(header)
with open(os.path.join(base_dir, "components", "Footer.jsx"), "w", encoding="utf-8") as f: f.write(footer)
with open(os.path.join(base_dir, "components", "HeroBanner.jsx"), "w", encoding="utf-8") as f: f.write(hero)
with open(os.path.join(base_dir, "components", "ProductList.jsx"), "w", encoding="utf-8") as f: f.write(products)
with open(os.path.join(base_dir, "components", "CategoryList.jsx"), "w", encoding="utf-8") as f: f.write(categories)
with open(os.path.join(base_dir, "components", "PostList.jsx"), "w", encoding="utf-8") as f: f.write(posts)

# 3. Layouts
layout = """import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
"""
with open(os.path.join(base_dir, "layouts", "MainLayout.jsx"), "w", encoding="utf-8") as f: f.write(layout)

# 4. Pages
home = """import React from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroBanner from '../components/HeroBanner';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import PostList from '../components/PostList';

const HomePage = () => {
    return (
        <MainLayout>
            <HeroBanner />
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 d-none d-lg-block">
                        <CategoryList />
                        
                        <div className="card shadow-sm border-0 rounded-4 bg-gradient-primary text-white text-center p-4 mt-4 hover-scale">
                            <i className="fas fa-headset fs-1 mb-3 text-warning"></i>
                            <h5 className="fw-bold">Hỗ trợ 24/7</h5>
                            <p className="small mb-0 opacity-75">Hotline: 1900 1234</p>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <ProductList />
                    </div>
                </div>
                
                <hr className="my-5 opacity-25" />
                
                <PostList />
            </div>
        </MainLayout>
    );
};

export default HomePage;
"""
with open(os.path.join(base_dir, "pages", "HomePage.jsx"), "w", encoding="utf-8") as f: f.write(home)

# 5. App.jsx
app_jsx = """import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css'; // Mẫu CSS chung

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
"""
with open(os.path.join(base_dir, "App.js"), "w", encoding="utf-8") as f: f.write(app_jsx)

# 6. index.js & CSS
index_js = """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
with open(os.path.join(base_dir, "index.js"), "w", encoding="utf-8") as f: f.write(index_js)

css = """
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background-color: #f8f9fc;
    color: #2c3e50;
    overflow-x: hidden;
}

.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Gradients & Colors */
.text-gradient {
    background: linear-gradient(135deg, #4e73df 0%, #1cc88a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
.bg-gradient-primary {
    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
}

/* Header Glassmorphism */
.glass-header {
    background: rgba(33, 37, 41, 0.95) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

/* Animations */
.hover-scale { transition: transform 0.3s ease; }
.hover-scale:hover { transform: translateY(-5px); }
.product-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.product-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
.img-zoom { transition: transform 0.5s ease; }
.product-card:hover .img-zoom, .blog-card:hover .img-zoom { transform: scale(1.1); }
.btn-glow { transition: all 0.3s; }
.btn-glow:hover { box-shadow: 0 0 15px rgba(78, 115, 223, 0.5); }
.hover-glow:hover { text-shadow: 0 0 10px rgba(255,255,255,0.5); }

/* Typography */
.text-truncate-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.title-underline::after {
    content: ''; position: absolute; bottom: -8px; left: 0; width: 50px; height: 3px;
    background: linear-gradient(90deg, #4e73df, #1cc88a); border-radius: 3px;
}
.title-underline.mx-auto::after { left: 50%; transform: translateX(-50%); }

/* Hero Banner */
.hero-banner {
    background: linear-gradient(135deg, #1a237e 0%, #4a148c 100%);
    border-radius: 0 0 40px 40px;
}
.bg-shape { position: absolute; border-radius: 50%; filter: blur(60px); z-index: 0; }
.shadow-1 { top: -100px; left: -100px; width: 400px; height: 400px; background: rgba(78, 115, 223, 0.4); }
.shadow-2 { bottom: -100px; right: -100px; width: 300px; height: 300px; background: rgba(28, 200, 138, 0.4); }

/* Categories */
.cat-item { transition: all 0.2s; cursor: pointer; border-radius: 8px !important; }
.cat-item:hover { background: rgba(78, 115, 223, 0.05) !important; padding-left: 20px !important; }
.cat-item:hover a { color: #4e73df !important; }
.cat-item:hover i { color: #4e73df !important; }

/* Utilities */
.rounded-bl-3 { border-bottom-left-radius: 12px; }
.z-index-1 { position: relative; z-index: 1; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.fade-in-up { animation: fadeInUp 0.8s forwards; opacity: 0; }
.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
"""
with open(os.path.join(base_dir, "App.css"), "w", encoding="utf-8") as f: f.write(css)

# Update index.html
html_path = os.path.join(base_dir, "..", "public", "index.html")
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()
if "bootstrap.min.css" not in html:
    new_head = """
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    """
    html = html.replace("<title>", new_head + "\n    <title>")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html)

print("React app setup successfully.")
