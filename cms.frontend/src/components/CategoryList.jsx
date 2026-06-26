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
        <div className="py-4 my-4 border-bottom border-top">
            <div className="container">
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
                    {categories.map(c => (
                        <Link 
                            key={c.id} 
                            to={`/products?category=${c.id}`} 
                            className="btn btn-outline-dark rounded-0 px-4 py-2 fw-bold text-uppercase d-flex align-items-center gap-2" 
                            style={{
                                fontFamily: 'Oswald', 
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                borderWidth: '1px',
                                fontSize: '0.9rem'
                            }}>
                            <i className="fas fa-shoe-prints small"></i> {c.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
