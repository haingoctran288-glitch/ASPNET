import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';
import { CartContext } from '../context/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        axiosClient.get(`/ProductApi/${id}`)
            .then(res => { setProduct(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [id]);

    if (loading) return <MainLayout><div className="text-center py-5"><div className="spinner-border text-primary"></div></div></MainLayout>;
    if (!product) return <MainLayout><div className="text-center py-5"><h3>Không tìm thấy sản phẩm!</h3></div></MainLayout>;

    const imgUrl = product.imageUrl ? (product.imageUrl.startsWith('/') || product.imageUrl.startsWith('http') ? product.imageUrl : '/' + product.imageUrl) : "https://via.placeholder.com/600x400";
    const fullImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5173${imgUrl}`;

    const handleAddToCart = () => {
        if (product.sizes && !selectedSize) {
            alert('Vui lòng chọn size giày!');
            return;
        }
        addToCart({ ...product, quantity, selectedSize });
        alert('Đã thêm vào giỏ hàng!');
    };

    const handleBuyNow = () => {
        if (product.sizes && !selectedSize) {
            alert('Vui lòng chọn size giày!');
            return;
        }
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = currentCart.find(i => i.id === product.id && i.selectedSize === selectedSize);
        let cartItemId = Date.now().toString();
        if(!existing) {
            const newItem = { ...product, quantity: quantity, selectedSize, cartItemId };
            currentCart.push(newItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
        } else {
            cartItemId = existing.cartItemId;
            existing.quantity += quantity;
            localStorage.setItem('cart', JSON.stringify(currentCart));
        }
        localStorage.setItem('selectedItems', JSON.stringify([cartItemId]));
        window.location.href = '/checkout';
    };

    return (
        <MainLayout>
            <div className="container py-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb" style={{fontFamily: 'Inter'}}>
                        <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-dark fw-bold">Trang chủ</Link></li>
                        <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-dark fw-bold">Sản phẩm</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                    </ol>
                </nav>
                
                <div className="row g-5">
                    <div className="col-md-6">
                        <div className="card border-0 rounded-0 overflow-hidden bg-light">
                            <img src={fullImg} alt={product.name} className="img-fluid" style={{width: '100%', objectFit: 'cover'}} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <h1 className="brand-font mb-3 display-5">{product.name}</h1>
                        <h2 className="text-accent fw-bold mb-4" style={{fontFamily: 'Oswald'}}>{product.price.toLocaleString('vi-VN')} ₫</h2>
                        
                        <div className="mb-4">
                            <span className={`badge ${product.stockQuantity > 0 ? 'bg-success' : 'bg-dark'} fs-6 rounded-0 px-3 py-2 shadow-sm`} style={{fontFamily: 'Inter'}}>
                                {product.stockQuantity > 0 ? `CÒN HÀNG (${product.stockQuantity})` : 'HẾT HÀNG'}
                            </span>
                        </div>
                        
                        <p className="lead text-secondary mb-4" style={{lineHeight: '1.8'}}>
                            {product.description || "Chưa có mô tả cho sản phẩm này."}
                        </p>

                        {product.sizes && (
                            <div className="mb-4">
                                <span className="fw-bold me-3 d-block mb-2" style={{fontFamily: 'Oswald'}}>CÁC SIZE HIỆN CÓ:</span>
                                <div className="d-flex flex-wrap gap-2">
                                    {product.sizes.split(',').map((s, idx) => {
                                        const sizeVal = s.trim();
                                        return (
                                        <button 
                                            key={idx} 
                                            onClick={() => setSelectedSize(sizeVal)}
                                            className={`btn rounded-0 px-3 py-2 fw-bold ${selectedSize === sizeVal ? 'btn-dark' : 'btn-outline-dark bg-white'}`} 
                                            style={{minWidth: '45px', textAlign: 'center'}}>
                                            {sizeVal}
                                        </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="d-flex align-items-center mb-4">
                            <span className="fw-bold me-3" style={{fontFamily: 'Oswald'}}>SỐ LƯỢNG:</span>
                            <div className="d-flex align-items-center bg-white rounded-0 px-2 py-1 shadow-sm border">
                                <button className="btn btn-sm btn-link text-dark text-decoration-none" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}><i className="fas fa-minus"></i></button>
                                <span className="fw-bold px-4">{quantity}</span>
                                <button className="btn btn-sm btn-link text-dark text-decoration-none" onClick={() => setQuantity(q => q < product.stockQuantity ? q + 1 : q)}><i className="fas fa-plus"></i></button>
                            </div>
                        </div>
                        
                        <div className="d-grid gap-3 d-md-flex">
                            <button className="btn-premium px-5" disabled={product.stockQuantity <= 0} onClick={handleAddToCart}>
                                THÊM VÀO GIỎ
                            </button>
                            <button className="btn-premium-outline px-5" disabled={product.stockQuantity <= 0} onClick={handleBuyNow}>
                                MUA NGAY
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
export default ProductDetailPage;
