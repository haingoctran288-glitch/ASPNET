import React from 'react';
import MainLayout from '../layouts/MainLayout';
import HeroBanner from '../components/HeroBanner';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import PostList from '../components/PostList';

const HomePage = () => {
    return (
        <MainLayout>
            <HeroBanner />
            <CategoryList />
            <div className="container" id="products">
                <div className="mb-5">
                    <ProductList title="SẢN PHẨM MỚI NHẤT" endpoint="/ProductApi/newest" />
                </div>
                
                <div className="mb-5">
                    <ProductList title="SẢN PHẨM HOT" endpoint="/ProductApi/hot" />
                </div>
                
                <div className="mb-5">
                    <PostList title="TIN TỨC QUAN TRỌNG" endpoint="/PostApi/newest" />
                </div>
            </div>
        </MainLayout>
    );
};

export default HomePage;
