import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Calendar,
    Clock,
    DollarSign,
    MapPin,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HirerLayout from '../../components/hirer/HirerLayout';

const PostShift = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        location: '',
        address: '',
        date: '',
        startTime: '',
        endTime: '',
        budget: '',
        workersNeeded: 1,
        requirements: '',
        benefits: ''
    });

    const steps = [
        { number: 1, title: 'Job Details', icon: Briefcase },
        { number: 2, title: 'Location & Time', icon: MapPin },
        { number: 3, title: 'Budget & Requirements', icon: DollarSign },
    ];

    const categories = [
        'Kitchen Staff',
        'Event Staff',
        'Warehouse Helper',
        'Restaurant Server',
        'Cleaning Staff',
        'Delivery Helper',
        'Office Assistant',
        'Hospitality',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        navigate('/hirer/manage-jobs');
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Kitchen Helper, Event Staff"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category }))}
                            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                formData.category === category
                                    ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white'
                                    : 'border-gray-200 text-gray-700 hover:border-[#1F4E5F] hover:bg-[#1F4E5F]/5'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the job responsibilities, expectations, and any specific skills required..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all resize-none"
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="inline mr-1" />
                    Location/Area *
                </label>
                <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                >
                    <option value="">Select Location</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address
                </label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Shift Date *
                </label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock size={16} className="inline mr-1" />
                        Start Time *
                    </label>
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock size={16} className="inline mr-1" />
                        End Time *
                    </label>
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign size={16} className="inline mr-1" />
                        Budget per Shift (Rs) *
                    </label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g., 1200"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users size={16} className="inline mr-1" />
                        Workers Needed *
                    </label>
                    <input
                        type="number"
                        name="workersNeeded"
                        value={formData.workersNeeded}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (Optional)
                </label>
                <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any specific requirements like experience, skills, certifications..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits (Optional)
                </label>
                <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Meals provided, Transportation allowance, Tips included..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1F4E5F] focus:ring-2 focus:ring-[#1F4E5F]/10 outline-none transition-all resize-none"
                />
            </div>

            {/* Preview Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Shift Preview</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Title:</span>
                        <span className="font-medium text-gray-800">{formData.title || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium text-gray-800">{formData.category || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium text-gray-800">{formData.location || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Date & Time:</span>
                        <span className="font-medium text-gray-800">
                            {formData.date ? new Date(formData.date).toLocaleDateString() : '-'} {formData.startTime} - {formData.endTime}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Budget:</span>
                        <span className="font-medium text-emerald-600">Rs {formData.budget || '0'}/shift</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Workers:</span>
                        <span className="font-medium text-gray-800">{formData.workersNeeded}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <HirerLayout>
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Post a New Shift</h1>
                        <p className="text-gray-500">Fill in the details to find the perfect workers</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex flex-col items-center relative z-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                    currentStep >= step.number
                                        ? 'bg-[#1F4E5F] text-white'
                                        : 'bg-gray-100 text-gray-400'
                                }`}>
                                    <step.icon size={20} />
                                </div>
                                <p className={`mt-2 text-sm font-medium ${
                                    currentStep >= step.number ? 'text-[#1F4E5F]' : 'text-gray-400'
                                }`}>
                                    {step.title}
                                </p>
                            </div>
                        ))}
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                            <div 
                                className="h-full bg-[#1F4E5F] transition-all"
                                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={prevStep}
                            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                                currentStep === 1
                                    ? 'opacity-0 pointer-events-none'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <ArrowLeft size={18} />
                            Previous
                        </button>
                        
                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-3 rounded-xl bg-[#1F4E5F] text-white font-semibold hover:bg-[#2D6A7A] transition-colors flex items-center gap-2"
                            >
                                Next
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center gap-2"
                            >
                                Post Shift
                                <Briefcase size={18} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </HirerLayout>
    );
};

export default PostShift;
