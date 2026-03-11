import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-10 px-4">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1F4E5F] to-[#4A9287] flex items-center justify-center shadow-sm">
                        <span className="text-white font-black text-sm leading-none">N</span>
                    </div>
                    <span className="text-lg font-bold text-[#1F2937] tracking-tight">Nepshift</span>
                </Link>

                {/* Minimal links */}
                <div className="flex items-center gap-6 text-sm text-[#1F2937]/45 font-medium">
                    <a href="#" className="hover:text-[#4A9287] transition-colors">Privacy</a>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <a href="#" className="hover:text-[#4A9287] transition-colors">Terms</a>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <a href="#" className="hover:text-[#4A9287] transition-colors">Contact</a>
                </div>

                {/* Copyright */}
                <p className="text-xs text-[#1F2937]/35 font-medium">
                    &copy; {new Date().getFullYear()} Nepshift. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
