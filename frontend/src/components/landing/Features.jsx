import React from 'react';
import { Briefcase, DollarSign, MapPin, Calendar, Users, Rocket, ShieldCheck, MessageSquare } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-dark/5 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 group">
        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 text-primary">
            <Icon size={32} />
        </div>
        <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-dark/50 leading-relaxed font-medium">{description}</p>
    </div>
);

const Features = () => {
    const helperFeatures = [
        {
            icon: Briefcase,
            title: "Flexible Work",
            description: "Access a wide range of temporary shifts that fit your schedule and lifestyle."
        },
        {
            icon: DollarSign,
            title: "Fair Pay",
            description: "Get competitive rates for your skills with transparent payment processing."
        },
        {
            icon: MapPin,
            title: "Local Opportunities",
            description: "Find shifts close to home, reducing commute times and increasing convenience."
        },
        {
            icon: Calendar,
            title: "Easy Scheduling",
            description: "Manage your availability and accept shifts directly through our intuitive platform."
        }
    ];

    const hirerFeatures = [
        {
            icon: Users,
            title: "Skilled Talent",
            description: "Connect with a network of vetted and reliable workers for your business needs."
        },
        {
            icon: Rocket,
            title: "Quick Staffing",
            description: "Fill urgent shifts rapidly with qualified helpers, often within hours."
        },
        {
            icon: ShieldCheck,
            title: "Reliable Matching",
            description: "Our location-based system ensures efficient and relevant worker recommendations."
        },
        {
            icon: MessageSquare,
            title: "Seamless Communication",
            description: "Directly communicate with Helpers to ensure clear expectations and smooth shifts."
        }
    ];

    return (
        <section className="py-32 px-4 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black text-dark mb-6">Why Choose Nepshift?</h2>
                    <p className="text-dark/40 text-lg font-bold uppercase tracking-[0.2em]">Excellence in every shift</p>
                </div>

                <div className="mb-32">
                    <div className="flex items-center space-x-4 mb-12">
                        <h3 className="text-3xl font-black text-dark">For Helpers</h3>
                        <div className="flex-1 h-px bg-dark/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {helperFeatures.slice(0, 3).map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        <div className="lg:col-start-1">
                            <FeatureCard {...helperFeatures[3]} />
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center space-x-4 mb-12">
                        <h3 className="text-3xl font-black text-dark">For Hirers</h3>
                        <div className="flex-1 h-px bg-dark/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hirerFeatures.slice(0, 3).map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        <div className="lg:col-start-1">
                            <FeatureCard {...hirerFeatures[3]} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
