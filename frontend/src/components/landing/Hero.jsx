import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24 pb-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50 via-white to-white">

            {/* Soft ambient orbs */}
            <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-200/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-10 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    Trusted by 10,000+ Users in Nepal
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1F2937] leading-[1.08] tracking-tight mb-7">
                    Connect. Work.{' '}
                    <span className="bg-gradient-to-r from-[#1F4E5F] to-[#34D399] bg-clip-text text-transparent italic">
                        Thrive.
                    </span>
                    <br />
                    Your Local{' '}
                    <span className="bg-gradient-to-r from-[#1F4E5F] to-[#34D399] bg-clip-text text-transparent">
                        Shift Partner.
                    </span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-[#1F2937]/55 max-w-2xl leading-relaxed mb-12">
                    Nepshift connects reliable{' '}
                    <span className="text-[#1F2937] font-semibold">Helpers</span> with local{' '}
                    <span className="text-[#1F2937] font-semibold">Hirers</span> for temporary shifts.
                    Find flexible work or skilled talent — fast.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
                    <Link
                        to="/register"
                        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#1F4E5F] to-[#4A9287] hover:from-[#1a3f4d] hover:to-[#3d7a72] text-white px-9 py-4 rounded-full font-semibold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-200 hover:scale-[1.03]"
                    >
                        Find Work
                        <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                        to="/register"
                        className="flex items-center gap-2.5 bg-white text-[#1F2937] border border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 px-9 py-4 rounded-full font-semibold text-base shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03]"
                    >
                        <Briefcase size={17} />
                        Post a Shift
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="w-full max-w-xl mx-auto pt-8 border-t border-gray-100 grid grid-cols-4 gap-4">
                    {[
                        { value: '500+', label: 'Shifts Daily' },
                        { value: '15k+', label: 'Helpers' },
                        { value: '2k+', label: 'Hirers' },
                        { value: '4.9★', label: 'Avg Rating' },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-0.5">
                            <span className="text-xl md:text-2xl font-bold text-[#1F2937]">{value}</span>
                            <span className="text-xs text-[#1F2937]/45 font-medium uppercase tracking-wider">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
