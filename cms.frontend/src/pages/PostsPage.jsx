import React from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PostList from '../components/PostList';

const PostsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    
    const endpoint = categoryId ? `/PostApi/category/${categoryId}` : '/PostApi';

    return (
        <MainLayout>
            <div className="bg-dark text-white py-5 mb-5 text-center position-relative" style={{background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/banner-giay-bong-da.jpg) center/cover'}}>
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
