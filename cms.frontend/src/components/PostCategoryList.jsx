import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const PostCategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axiosClient.get('/CategoryApi').then(res => setCategories(res.data)).catch(console.log);
    }, []);

    return (
        <div className="card shadow-soft border-0 rounded-4 mb-4 bg-glass">
            <div className="card-header bg-transparent border-0 pt-4 pb-2">
                <h5 className="fw-bold mb-0"><i className="fas fa-newspaper text-gradient me-2"></i>Danh mục bài viết</h5>
            </div>
            <div className="card-body p-2 pb-4">
                <ul className="list-group list-group-flush">
                    {categories.map(c => (
                        <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center border-0 bg-transparent mb-1 cat-item rounded-3">
                            <a href={`/posts?category=${c.id}`} className="text-decoration-none fw-semibold text-dark w-100">{c.name}</a>
                            <i className="fas fa-chevron-right text-muted small"></i>
                        </li>
                    ))}
                    {categories.length === 0 && <p className="text-muted small px-3">Đang tải...</p>}
                </ul>
            </div>
        </div>
    );
};

export default PostCategoryList;
