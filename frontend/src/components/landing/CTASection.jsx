import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto rounded-[3rem] bg-gradient-to-br from-[#407B72] to-[#2D5A53] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-[#407B72]/30">
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl animate-bounce-slow">
                            <Sparkles className="text-white" size={32} />
                        </div>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-tight">
                        Ready to Start Your <br />
                        <span className="text-white/70 italic">Success Journey?</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
                        Join Nepshift today and simplify your temporary staffing needs or find your next flexible work opportunity.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto bg-white text-[#407B72] px-12 py-5 rounded-2xl font-black text-xl hover:bg-secondary transition-all transform hover:scale-[1.05] shadow-xl hover:shadow-2xl"
                        >
                            Join as a Helper
                        </Link>
                        <Link
                            to="/register"
                            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all transform hover:scale-[1.05]"
                        >
                            Hire Talent Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
