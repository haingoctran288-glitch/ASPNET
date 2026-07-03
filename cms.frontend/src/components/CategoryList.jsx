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
                <div className="row g-3 justify-content-center">
                    {categories.map((c, index) => (
                        <div key={c.id} className="col-6 col-md-4 col-lg-2">
                            <Link 
                                to={`/products?category=${c.id}`} 
                                className="text-decoration-none d-block category-block"
                            >
                                <div className="text-center category-block p-3">
                                    <div className="img-wrapper rounded-circle shadow-sm bg-white mx-auto mb-3 d-flex align-items-center justify-content-center category-avatar" 
                                         style={{width: '130px', height: '130px', overflow: 'hidden', border: '2px solid #f8f9fa'}}>
                                        <img 
                                            src={c.imageUrl ? (c.imageUrl.startsWith('http') ? c.imageUrl : `${process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:5173"}${c.imageUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=150`}
                                            alt={c.name} 
                                            style={{transition: 'transform 0.3s ease', width: '100%', height: '100%', objectFit: 'contain', padding: '15px'}}
                                        />
                                    </div>
                                    <h6 className="fw-bold text-dark text-uppercase m-0 brand-name" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>{c.name}</h6>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .category-avatar { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important; }
                .category-block:hover .category-avatar { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(220,53,69,0.2) !important; border-color: #dc3545 !important; }
                .category-block:hover img { transform: scale(1.1); }
                .brand-name { transition: color 0.3s ease; }
                .category-block:hover .brand-name { color: #dc3545 !important; }
            `}</style>
        </div>
    );
};

export default CategoryList;
