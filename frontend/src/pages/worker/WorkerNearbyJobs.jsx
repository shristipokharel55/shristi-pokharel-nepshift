import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MapPin,
    Clock,
    DollarSign,
    Star,
    Filter,
    Search,
    Briefcase,
    Building,
    ArrowUpRight
} from 'lucide-react';
import WorkerLayout from '../../components/worker/WorkerLayout';

const JobCard = ({ job, delay }) => {
    const navigate = useNavigate();

    return (
        <div
            className="glass-card rounded-2xl p-6 card-hover animate-fade-in-up opacity-0"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0B4B54] to-[#82ACAB] flex items-center justify-center">
                        <Briefcase size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#032A33] text-lg">{job.title}</h3>
                        <div className="flex items-center gap-2 text-[#888888]">
                            <Building size={14} />
                            <span className="text-sm">{job.company}</span>
                        </div>
                    </div>
                </div>
                <span className={`
          px-3 py-1.5 rounded-full text-xs font-semibold
          ${job.tag === 'Urgent'
                        ? 'bg-red-100 text-red-600'
                        : job.tag === 'New'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-[#82ACAB]/20 text-[#0B4B54]'
                    }
        `}>
                    {job.tag}
                </span>
            </div>

            <p className="text-[#888888] text-sm mb-4 line-clamp-2">{job.description}</p>

            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-[#82ACAB]" />
                    <span className="text-[#032A33]">{job.location}</span>
                    <span className="text-[#888888]">({job.distance})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-[#82ACAB]" />
                    <span className="text-[#032A33]">{job.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-[#82ACAB]" />
                    <span className="text-[#032A33] font-semibold">Rs {job.pay}/shift</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#82ACAB]/20">
                <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-[#032A33]">{job.rating}</span>
                    <span className="text-[#888888] text-sm">({job.reviews} reviews)</span>
                </div>
                <button className="
          px-5 py-2.5 rounded-xl
          bg-[#0B4B54] hover:bg-[#0D5A65]
          text-white font-semibold text-sm
          transition-all duration-200 flex items-center gap-2
          shadow-lg shadow-[#0B4B54]/20
        ">
                    Apply Now
                    <ArrowUpRight size={16} />
                </button>
            </div>
        </div>
    );
};

const WorkerNearbyJobs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Hospitality', 'Warehouse', 'Events', 'Kitchen', 'Cleaning'];

    const nearbyJobs = [
        {
            id: 1,
            title: 'Kitchen Helper',
            company: 'Hotel Himalaya',
            description: 'Looking for an experienced kitchen helper for morning shifts. Must be punctual and hardworking.',
            location: 'Lalitpur',
            distance: '2.5 km',
            time: '6:00 AM - 2:00 PM',
            pay: '1,200',
            rating: 4.8,
            reviews: 124,
            tag: 'Recommended'
        },
        {
            id: 2,
            title: 'Event Staff',
            company: 'Marriott Hotel',
            description: 'Need staff for a wedding event. Experience in hospitality preferred but not required.',
            location: 'Kathmandu',
            distance: '3.1 km',
            time: '4:00 PM - 11:00 PM',
            pay: '1,500',
            rating: 4.5,
            reviews: 89,
            tag: 'New'
        },
        {
            id: 3,
            title: 'Warehouse Helper',
            company: 'Daraz Nepal',
            description: 'Package sorting and inventory management. Physical fitness required.',
            location: 'Bhaktapur',
            distance: '5.2 km',
            time: '8:00 AM - 4:00 PM',
            pay: '1,000',
            rating: 4.3,
            reviews: 67,
            tag: 'Urgent'
        },
        {
            id: 4,
            title: 'Restaurant Server',
            company: 'Cafe Mitra',
            description: 'Serve customers and maintain cleanliness. Good communication skills needed.',
            location: 'Patan',
            distance: '1.8 km',
            time: '11:00 AM - 7:00 PM',
            pay: '1,100',
            rating: 4.6,
            reviews: 45,
            tag: 'New'
        },
        {
            id: 5,
            title: 'Cleaning Staff',
            company: 'Hyatt Regency',
            description: 'Hotel room cleaning and housekeeping. Training provided.',
            location: 'Boudha',
            distance: '4.0 km',
            time: '7:00 AM - 3:00 PM',
            pay: '1,300',
            rating: 4.7,
            reviews: 156,
            tag: 'Recommended'
        },
    ];

    return (
        <WorkerLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#032A33] mb-2">Nearby Jobs</h1>
                    <p className="text-[#888888]">Find shifts available near your location</p>
                </div>

                {/* Search and Filters */}
                <div className="glass-card rounded-2xl p-6 mb-8 animate-fade-in-up">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" />
                            <input
                                type="text"
                                placeholder="Search jobs by title, company, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="
                  w-full pl-12 pr-4 py-3 rounded-xl
                  bg-[#D3E4E7]/30 border border-[#82ACAB]/30
                  text-[#032A33] placeholder-[#888888]
                  focus:outline-none focus:border-[#0B4B54] focus:ring-2 focus:ring-[#0B4B54]/10
                  transition-all
                "
                            />
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-[#D3E4E7] text-[#0B4B54] font-semibold hover:bg-[#82ACAB]/30 transition-colors flex items-center justify-center gap-2">
                            <Filter size={18} />
                            More Filters
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`
                  px-4 py-2 rounded-xl font-medium text-sm transition-all
                  ${activeFilter === filter
                                        ? 'bg-[#0B4B54] text-white shadow-lg shadow-[#0B4B54]/20'
                                        : 'bg-[#D3E4E7]/50 text-[#032A33] hover:bg-[#82ACAB]/30'
                                    }
                `}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-[#888888]">
                        Showing <span className="font-semibold text-[#032A33]">{nearbyJobs.length}</span> jobs near you
                    </p>
                    <select className="px-4 py-2 rounded-xl bg-white border border-[#82ACAB]/30 text-[#032A33] focus:outline-none focus:border-[#0B4B54]">
                        <option>Sort by: Nearest</option>
                        <option>Sort by: Highest Pay</option>
                        <option>Sort by: Rating</option>
                        <option>Sort by: Newest</option>
                    </select>
                </div>

                {/* Job Listings */}
                <div className="space-y-6">
                    {nearbyJobs.map((job, index) => (
                        <JobCard key={job.id} job={job} delay={index * 100} />
                    ))}
                </div>
            </div>
        </WorkerLayout>
    );
};

export default WorkerNearbyJobs;
