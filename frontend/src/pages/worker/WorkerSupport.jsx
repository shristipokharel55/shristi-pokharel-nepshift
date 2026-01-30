import React, { useState } from 'react';
import {
    HelpCircle,
    MessageCircle,
    Phone,
    Mail,
    ChevronDown,
    ChevronUp,
    Search,
    ExternalLink
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <div
        className="glass-card rounded-xl overflow-hidden cursor-pointer"
        onClick={onClick}
    >
        <div className="flex items-center justify-between p-5">
            <h4 className="font-medium text-[#032A33]">{question}</h4>
            {isOpen ? (
                <ChevronUp size={20} className="text-[#0B4B54]" />
            ) : (
                <ChevronDown size={20} className="text-[#888888]" />
            )}
        </div>
        {isOpen && (
            <div className="px-5 pb-5 pt-0 text-[#888888] border-t border-[#82ACAB]/20 mt-0">
                <p className="pt-4">{answer}</p>
            </div>
        )}
    </div>
);

const WorkerSupport = () => {
    const [openFAQ, setOpenFAQ] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            question: 'How do I apply for a job?',
            answer: 'Navigate to "Nearby Jobs" from the sidebar, browse available shifts, and click "Apply Now" on any job that interests you. Make sure your profile is complete for better chances of acceptance.'
        },
        {
            question: 'When will I receive my payment?',
            answer: 'Payments are processed within 24-48 hours after job completion and employer verification. You can check your payment status in the "Earnings & Payments" section.'
        },
        {
            question: 'How can I update my availability?',
            answer: 'Go to "Availability & Schedule" from the sidebar. Click on time slots to toggle your availability. Green means available, gray means unavailable.'
        },
        {
            question: 'What should I do if I need to cancel a shift?',
            answer: 'Please contact the employer as soon as possible through the chat feature. Frequent cancellations may affect your rating and future job opportunities.'
        },
        {
            question: 'How is my rating calculated?',
            answer: 'Your rating is an average of all reviews from employers. Factors include punctuality, work quality, and professionalism. Higher ratings increase your visibility to employers.'
        },
    ];

    return (
        <WorkerLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Support / Help</h1>
                    <p className="text-[#888888]">Get help with your queries and issues</p>
                </div>

                {/* Search */}
                <div className="relative mb-8 animate-fade-in-up">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
                    <input
                        type="text"
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="
              w-full pl-12 pr-4 py-4 rounded-2xl
              glass-card border-0
              text-[#032A33] placeholder-[#888888]
              focus:outline-none focus:ring-2 focus:ring-[#0B4B54]/20
              transition-all
            "
                    />
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support', color: 'bg-blue-100 text-blue-600' },
                        { icon: Phone, title: 'Call Us', desc: '+977 1234567890', color: 'bg-emerald-100 text-emerald-600' },
                        { icon: Mail, title: 'Email', desc: 'support@nepshift.com', color: 'bg-purple-100 text-purple-600' },
                    ].map((contact, index) => (
                        <button
                            key={index}
                            className="glass-card rounded-2xl p-6 text-left hover:shadow-lg transition-all animate-fade-in-up group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-xl ${contact.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <contact.icon size={24} />
                            </div>
                            <h4 className="font-semibold text-[#032A33] mb-1">{contact.title}</h4>
                            <p className="text-sm text-[#888888]">{contact.desc}</p>
                        </button>
                    ))}
                </div>

                {/* FAQs */}
                <div className="mb-8">
                    <h3 className="font-semibold text-[#032A33] text-lg mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFAQ === index}
                                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                            />
                        ))}
                    </div>
                </div>

                {/* Still Need Help */}
                <div className="glass-card rounded-2xl p-8 text-center animate-fade-in-up">
                    <HelpCircle size={48} className="mx-auto text-[#82ACAB] mb-4" />
                    <h3 className="text-xl font-semibold text-[#032A33] mb-2">Still need help?</h3>
                    <p className="text-[#888888] mb-6">Our support team is available 24/7 to assist you.</p>
                    <button className="px-8 py-3 rounded-xl bg-[#0B4B54] text-white font-semibold hover:bg-[#0D5A65] transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#0B4B54]/20">
                        Contact Support
                        <ExternalLink size={18} />
                    </button>
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerSupport;
