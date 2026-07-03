import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axiosClient.get('/CategoryProductApi')
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));
    }, []);

    if (categories.length === 0) return null;

    return (
        <div className="py-5 bg-light my-4">
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="brand-font fs-1 m-0 text-uppercase">Danh mục sản phẩm</h2>
                </div>
                <div className="row g-4 justify-content-center">
                    {categories.map((c, index) => (
                        <div key={c.id} className="col-6 col-md-3 col-lg-2">
                            <Link 
                                to={`/products?category=${c.id}`} 
                                className="text-decoration-none d-block category-block"
                            >
                                <div className="card border-0 rounded-0 shadow-sm text-center bg-white overflow-hidden category-card">
                                    <div className="img-wrapper d-flex align-items-center justify-content-center bg-white" style={{height: '150px', padding: '15px'}}>
                                        <img 
                                            src={c.imageUrl ? (c.imageUrl.startsWith('http') ? c.imageUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${c.imageUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=150`}
                                            alt={c.name} 
                                            className="img-fluid"
                                            style={{transition: 'transform 0.3s ease', maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}}
                                        />
                                    </div>
                                    <div className="card-body p-3">
                                        <h6 className="card-title fw-bold text-dark text-uppercase m-0" style={{fontFamily: 'Oswald', letterSpacing: '0.5px'}}>{c.name}</h6>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .category-card { transition: all 0.3s ease; }
                .category-block:hover .category-card { transform: translateY(-10px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; border-bottom: 3px solid #dc3545 !important; }
                .category-block:hover img { transform: scale(1.1); }
            `}</style>
        </div>
    );
};

export default CategoryList;
