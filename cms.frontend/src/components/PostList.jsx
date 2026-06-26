import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const PostList = ({ title = "Tin tức", endpoint = "/PostApi", paginate = false }) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        axiosClient.get(endpoint).then(res => {
            setPosts(res.data);
            setCurrentPage(1);
        }).catch(err => console.log(err));
    }, [endpoint]);

    if(posts.length === 0) return null;

    const displayedPosts = paginate ? posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : posts;
    const totalPages = Math.ceil(posts.length / itemsPerPage);

    return (
        <div className="mt-5 pt-4 mb-5">
            <h2 className="brand-font fs-1 text-center mb-5">{title}</h2>
            <div className="row g-4 justify-content-center">
                {displayedPosts.map(p => {
                    const imgUrl = p.imageUrl ? (p.imageUrl.startsWith('/') || p.imageUrl.startsWith('http') ? p.imageUrl : '/' + p.imageUrl) : "https://via.placeholder.com/400x250";
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5173${imgUrl}`;
                    return (
                    <div className="col-md-4" key={p.id}>
                        <div className="card border-0 rounded-0 overflow-hidden h-100 blog-card bg-light d-flex flex-column">
                            <div className="position-relative overflow-hidden">
                                <Link to={`/post/${p.id}`}>
                                    <img src={fullImg} className="card-img-top img-zoom rounded-0" alt={p.title} style={{height: '250px', objectFit: 'cover'}} />
                                </Link>
                            </div>
                            <div className="card-body p-4 d-flex flex-column">
                                <small className="text-accent fw-bold mb-2 d-block text-uppercase" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}><i className="far fa-calendar-alt me-1"></i> {new Date(p.createdDate).toLocaleDateString('vi-VN')}</small>
                                <Link to={`/post/${p.id}`} className="text-decoration-none">
                                    <h5 className="card-title fw-bold mt-2 text-dark line-clamp-2 text-uppercase" style={{lineHeight: '1.4', fontFamily: 'Oswald'}}>{p.title}</h5>
                                </Link>
                                <div className="card-text text-secondary small line-clamp-3 mt-3">
                                    {(() => {
                                        if (!p.content) return '';
                                        const doc = new DOMParser().parseFromString(p.content, 'text/html');
                                        return doc.body.textContent || "";
                                    })()}
                                </div>
                            </div>
                            <div className="card-footer bg-transparent border-0 p-4 pt-0 mt-auto">
                                <Link to={`/post/${p.id}`} className="btn-premium d-block w-100 text-center text-decoration-none py-2">
                                    XEM CHI TIẾT
                                </Link>
                            </div>
                        </div>
                    </div>
                )})}
            </div>

            {paginate && totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-5">
                    <ul className="pagination pagination-dark gap-2">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link rounded-0 border-dark text-dark" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button 
                                    className={`page-link rounded-0 border-dark ${currentPage === index + 1 ? 'bg-dark text-white' : 'text-dark'}`}
                                    onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link rounded-0 border-dark text-dark" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};

export default PostList;
