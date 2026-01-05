import React from 'react';
import { UserPlus, Search, Link as LinkIcon, CheckCircle } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description }) => (
    <div className="relative p-10 bg-secondary/50 rounded-[2.5rem] border border-white transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 group">
        <div className="absolute -top-6 -left-6 w-16 h-16 bg-dark text-white text-2xl font-black flex items-center justify-center rounded-2xl shadow-xl group-hover:bg-primary transition-colors duration-500">
            {number}
        </div>
        <div className="w-16 h-16 text-primary bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-bold text-dark mb-4">{title}</h3>
        <p className="text-dark/50 leading-relaxed font-medium">{description}</p>
    </div>
);

const HowItWorks = () => {
    const steps = [
        {
            icon: UserPlus,
            title: "Sign Up & Create Your Profile",
            description: "Register as a Helper or Hirer and set up your detailed profile in minutes."
        },
        {
            icon: Search,
            title: "Find or Post Shifts",
            description: "Helpers browse available shifts, while Hirers post their temporary staffing needs."
        },
        {
            icon: LinkIcon,
            title: "Connect & Confirm",
            description: "Helpers bid on shifts, Hirers review applications and confirm their preferred match."
        },
        {
            icon: CheckCircle,
            title: "Complete Shift & Rate",
            description: "Work the shift, get paid, and provide feedback to build a trustworthy community."
        }
    ];

    return (
        <section className="py-32 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black text-dark mb-6">How Nepshift Works</h2>
                    <p className="text-dark/40 text-lg font-bold uppercase tracking-[0.2em]">Simple steps to success</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {steps.map((step, idx) => (
                        <Step key={idx} number={idx + 1} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
