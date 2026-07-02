import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axiosClient from '../api/axiosClient';

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosClient.get(`/PostApi/${id}`)
            .then(res => { setPost(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [id]);

    if (loading) return <MainLayout><div className="text-center py-5"><div className="spinner-border text-primary"></div></div></MainLayout>;
    if (!post) return <MainLayout><div className="text-center py-5"><h3>Không tìm thấy bài viết!</h3></div></MainLayout>;

    const imgUrl = post.imageUrl ? (post.imageUrl.startsWith('/') || post.imageUrl.startsWith('http') ? post.imageUrl : '/' + post.imageUrl) : "https://via.placeholder.com/1200x600";
    const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5173';
    const fullImg = imgUrl.startsWith('http') ? imgUrl : `${IMAGE_BASE_URL}${imgUrl}`.replace(/([^:]\/)\/+/g, "$1");

    return (
        <MainLayout>
            <div className="container py-5 mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => navigate(-1)} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-8">
                        <div className="text-center mb-5">
                            <small className="text-accent fw-bold mb-3 d-block text-uppercase" style={{fontFamily: 'Oswald', letterSpacing: '1px'}}>
                                <i className="far fa-calendar-alt me-1"></i> {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                            </small>
                            <h1 className="brand-font display-4 mb-4" style={{lineHeight: '1.2'}}>{post.title}</h1>
                        </div>
                        
                        <div className="mb-5 overflow-hidden shadow-sm" style={{borderRadius: '0'}}>
                            <img src={fullImg} alt={post.title} className="w-100" style={{maxHeight: '600px', objectFit: 'cover'}} />
                        </div>
                        
                        <div className="post-content" style={{fontFamily: 'Inter', lineHeight: '1.8', fontSize: '1.1rem', color: '#444'}}
                             dangerouslySetInnerHTML={{ __html: post.content }}>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PostDetailPage;
