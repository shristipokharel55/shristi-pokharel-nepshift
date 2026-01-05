import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-32 pb-12 px-4 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 relative z-10">
                <div className="lg:col-span-1">
                    <Link to="/" className="flex items-center space-x-2 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className="text-3xl font-black tracking-tight text-white">Nepshift</span>
                    </Link>
                    <p className="text-white/40 mb-10 leading-relaxed font-medium text-lg">
                        Connecting talent with opportunity, one shift at a time. The most reliable location-based platform for temporary work in Nepal.
                    </p>
                    <div className="flex space-x-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                            <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-white/60">
                                <Icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-8">Quick Links</h4>
                    <ul className="space-y-4 text-white/40 font-medium">
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Our Story</span></a></li>
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Careers</span></a></li>
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Blog</span></a></li>
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Press</span></a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-8">Resources</h4>
                    <ul className="space-y-4 text-white/40 font-medium">
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Find Shifts</span></a></li>
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Hire Talent</span></a></li>
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>How it Works</span></a></li>
                        <li><a href="#" className="hover:text-primary transition-colors flex items-center space-x-2"><span>&rsaquo;</span> <span>Payouts</span></a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-bold mb-8">Contact Us</h4>
                    <ul className="space-y-6 text-white/40 font-medium">
                        <li className="flex items-start space-x-4">
                            <MapPin className="text-primary shrink-0" size={20} />
                            <span>Kathmandu, Nepal</span>
                        </li>
                        <li className="flex items-center space-x-4">
                            <Phone className="text-primary shrink-0" size={20} />
                            <span>+977 1 4XXXXXX</span>
                        </li>
                        <li className="flex items-center space-x-4">
                            <Mail className="text-primary shrink-0" size={20} />
                            <span>hello@nepshift.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm font-bold uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} Nepshift. All rights reserved.</p>
                <div className="flex space-x-8 mt-6 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Cookies</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
