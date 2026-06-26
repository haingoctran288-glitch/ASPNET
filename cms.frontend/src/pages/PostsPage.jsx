import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PostList from '../components/PostList';
import axiosClient from '../api/axiosClient';

const PostsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    
    const [bannerUrl, setBannerUrl] = useState('/banner-giay-bong-da.jpg');
    
    useEffect(() => {
        axiosClient.get('/BannerApi')
            .then(res => {
                if(res.data && res.data.length > 0) {
                    const imgUrl = res.data[0].imageUrl;
                    const fullImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5173${imgUrl}`;
                    setBannerUrl(fullImg);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const endpoint = categoryId ? `/PostApi/category/${categoryId}` : '/PostApi';

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bannerUrl}) center/cover`}}>
                <h1 className="brand-font display-4 fw-bold text-uppercase" style={{letterSpacing: '2px'}}>{categoryId ? "Bài viết theo danh mục" : "Tin tức quan trọng"}</h1>
                <p className="lead" style={{fontFamily: 'Inter', color: '#ccc'}}>Cập nhật những thông tin mới nhất về giày thể thao</p>
            </div>
            <div className="container mb-5">
                <button className="btn btn-link text-dark text-decoration-none p-0 mb-4 fw-bold" onClick={() => window.history.back()} style={{fontFamily: 'Oswald'}}>
                    <i className="fas fa-arrow-left me-2"></i> QUAY LẠI
                </button>
                <PostList title="" endpoint={endpoint} paginate={true} />
            </div>
        </MainLayout>
    );
};
export default PostsPage;
