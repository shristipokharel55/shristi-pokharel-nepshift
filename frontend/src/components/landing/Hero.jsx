import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-blob"></div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8 animate-bounce-slow">
                    <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                    <span className="text-sm font-bold tracking-wide uppercase">Trusted by 10,000+ Users</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-dark leading-[1.1] mb-8 tracking-tight">
                    Connect. Work. <span className="text-primary italic">Thrive.</span><br />
                    Your Local Shift Partner.
                </h1>

                <p className="text-xl md:text-2xl text-dark/60 max-w-3xl mx-auto mb-12 leading-relaxed">
                    Nepshift connects reliable <span className="text-dark font-bold underline decoration-primary/30">Helpers</span> with local <span className="text-dark font-bold underline decoration-primary/30">Hirers</span> for temporary shifts.
                    Find flexible work or skilled talent, fast.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Link
                        to="/register"
                        className="group w-full sm:w-auto bg-dark text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-dark/90 transition-all transform hover:scale-[1.02] shadow-2xl shadow-dark/20 flex items-center justify-center space-x-2"
                    >
                        <span>Find Work</span>
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/register"
                        className="w-full sm:w-auto bg-white text-dark border-2 border-dark/5 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-secondary/50 transition-all transform hover:scale-[1.02] shadow-xl shadow-black/5 flex items-center justify-center space-x-2"
                    >
                        <Play size={20} fill="currentColor" />
                        <span>Post a Shift</span>
                    </Link>
                </div>

                {/* Trust Badges or Stats */}
                <div className="mt-20 pt-10 border-t border-dark/5 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-dark">500+</span>
                        <span className="text-sm font-bold uppercase tracking-wider">Shifts Daily</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-dark">15k+</span>
                        <span className="text-sm font-bold uppercase tracking-wider">Helpers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-dark">2k+</span>
                        <span className="text-sm font-bold uppercase tracking-wider">Hirers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-dark">4.9/5</span>
                        <span className="text-sm font-bold uppercase tracking-wider">Rating</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
