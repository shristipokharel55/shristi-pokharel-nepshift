import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import HowItWorks from '../../components/landing/HowItWorks';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
            if (user.role === 'helper') {
                navigate('/helper/dashboard');
            } else if (user.role === 'hirer') {
                navigate('/hirer/dashboard');
            }
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary/30 selection:text-primary">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
