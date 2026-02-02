// frontend/src/components/ui/VerifiedBadge.jsx
import { BadgeCheck } from 'lucide-react';

/**
 * VerifiedBadge Component
 * Conditionally renders a verification badge based on user's verification status
 * 
 * @param {boolean} isVerified - Whether the user is verified
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {string} variant - Display variant: 'icon', 'badge', 'inline'
 * @param {boolean} showLabel - Whether to show the "Verified" text
 */
const VerifiedBadge = ({ 
    isVerified = false, 
    size = 'md', 
    variant = 'inline',
    showLabel = true,
    className = ''
}) => {
    // Don't render anything if not verified
    if (!isVerified) {
        return null;
    }

    // Size configurations
    const sizeConfig = {
        sm: {
            icon: 14,
            text: 'text-xs',
            padding: 'px-1.5 py-0.5',
            gap: 'gap-0.5'
        },
        md: {
            icon: 16,
            text: 'text-sm',
            padding: 'px-2 py-1',
            gap: 'gap-1'
        },
        lg: {
            icon: 20,
            text: 'text-base',
            padding: 'px-3 py-1.5',
            gap: 'gap-1.5'
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;

    // Icon only variant - Blue checkmark
    if (variant === 'icon') {
        return (
            <BadgeCheck 
                size={config.icon} 
                className={`text-blue-500 shrink-0 ${className}`}
                fill="currentColor"
                strokeWidth={0}
            />
        );
    }

    // Badge variant - Pill with icon and text
    if (variant === 'badge') {
        return (
            <span 
                className={`
                    inline-flex items-center ${config.gap} ${config.padding}
                    bg-blue-50 text-blue-600 border border-blue-200
                    rounded-full font-medium ${config.text}
                    ${className}
                `}
            >
                <BadgeCheck size={config.icon} className="shrink-0" />
                {showLabel && <span>Verified</span>}
            </span>
        );
    }

    // Inline variant (default) - Just icon with optional text
    return (
        <span 
            className={`
                inline-flex items-center ${config.gap} text-blue-500 font-medium ${config.text}
                ${className}
            `}
        >
            <BadgeCheck 
                size={config.icon} 
                className="shrink-0"
                fill="currentColor"
                strokeWidth={0}
            />
            {showLabel && <span className="text-blue-600">Verified</span>}
        </span>
    );
};

/**
 * VerificationStatusBadge Component
 * Shows the current verification status with appropriate styling
 * 
 * @param {string} status - 'pending', 'approved', 'rejected'
 */
export const VerificationStatusBadge = ({ status }) => {
    const statusConfig = {
        pending: {
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-200',
            label: 'Pending Verification'
        },
        approved: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-200',
            label: 'Verified',
            icon: BadgeCheck
        },
        rejected: {
            bg: 'bg-red-50',
            text: 'text-red-700',
            border: 'border-red-200',
            label: 'Rejected'
        }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span 
            className={`
                inline-flex items-center gap-1.5 px-2.5 py-1
                ${config.bg} ${config.text} ${config.border}
                border rounded-full text-xs font-semibold
            `}
        >
            {Icon && <Icon size={14} />}
            {config.label}
        </span>
    );
};

export default VerifiedBadge;
