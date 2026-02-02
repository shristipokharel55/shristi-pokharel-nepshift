import {
    Eye,
    EyeOff,
    Save
} from 'lucide-react';
import { useState } from 'react';

// Settings Section Component
const SettingsSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100/60">
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        {children}
    </div>
);

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-slate-700 font-medium">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-[#3B82F6]' : 'bg-slate-300'
                }`}
        >
            <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
            />
        </button>
    </div>
);

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        twoFactorAuth: false,
        maintenanceMode: false,
        autoApproveVerification: false,
        emailDigest: true,
    });

    const [profile, setProfile] = useState({
        name: 'System Administrator',
        email: 'admin@nepshift.com',
        phone: '+977-9800000000',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleProfileChange = (e) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-8 animate-fade-in-up" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Settings
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Manage your admin preferences and platform settings
                    </p>
                </div>
                <button className="px-5 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <SettingsSection
                    title="Profile Settings"
                    description="Update your admin profile information"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                            />
                        </div>
                    </div>
                </SettingsSection>

                {/* Security Settings */}
                <SettingsSection
                    title="Security Settings"
                    description="Manage your account security preferences"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] pr-12 transition-all"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                            />
                        </div>
                        <div className="pt-2 border-t border-slate-100">
                            <ToggleSwitch
                                enabled={settings.twoFactorAuth}
                                onChange={() => handleToggle('twoFactorAuth')}
                                label="Two-Factor Authentication"
                            />
                        </div>
                    </div>
                </SettingsSection>

                {/* Notification Settings */}
                <SettingsSection
                    title="Notification Preferences"
                    description="Control how you receive notifications"
                >
                    <div className="divide-y divide-slate-100">
                        <ToggleSwitch
                            enabled={settings.emailNotifications}
                            onChange={() => handleToggle('emailNotifications')}
                            label="Email Notifications"
                        />
                        <ToggleSwitch
                            enabled={settings.pushNotifications}
                            onChange={() => handleToggle('pushNotifications')}
                            label="Push Notifications"
                        />
                        <ToggleSwitch
                            enabled={settings.emailDigest}
                            onChange={() => handleToggle('emailDigest')}
                            label="Daily Email Digest"
                        />
                    </div>
                </SettingsSection>

                {/* Platform Settings */}
                <SettingsSection
                    title="Platform Settings"
                    description="Configure global platform behavior"
                >
                    <div className="divide-y divide-slate-100">
                        <ToggleSwitch
                            enabled={settings.maintenanceMode}
                            onChange={() => handleToggle('maintenanceMode')}
                            label="Maintenance Mode"
                        />
                        <ToggleSwitch
                            enabled={settings.autoApproveVerification}
                            onChange={() => handleToggle('autoApproveVerification')}
                            label="Auto-Approve Verifications"
                        />
                        <div className="py-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Platform Commission (%)
                            </label>
                            <input
                                type="number"
                                defaultValue="10"
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                            />
                        </div>
                    </div>
                </SettingsSection>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 mb-2 tracking-tight">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">
                    These actions are irreversible. Please proceed with caution.
                </p>
                <div className="flex flex-wrap gap-3">
                    <button className="px-5 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm">
                        Clear All Logs
                    </button>
                    <button className="px-5 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm">
                        Reset Platform Stats
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
