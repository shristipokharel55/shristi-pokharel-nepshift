import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CTASection from '../../components/landing/CTASection';
import Features from '../../components/landing/Features';
import Footer from '../../components/landing/Footer';
import Hero from '../../components/landing/Hero';
import HowItWorks from '../../components/landing/HowItWorks';
import Navbar from '../../components/landing/Navbar';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, loading } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated && user) {
            if (user.role === 'helper') {
                navigate('/worker/dashboard', { replace: true });
            } else if (user.role === 'hirer') {
                navigate('/hirer/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, user, loading, navigate]);

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
