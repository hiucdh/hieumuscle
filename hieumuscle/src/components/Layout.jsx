import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="pt-16">
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default Layout;
