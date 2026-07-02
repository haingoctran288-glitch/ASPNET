import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {

    return (
        <div className="app-container position-relative">
            <Header />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
