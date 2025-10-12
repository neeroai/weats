'use client';

import { Check, Clock, AlertCircle } from 'lucide-react';
import { WhatsAppColors } from '@/lib/deck/constants';

export type MessageStatusType = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface MessageStatusProps {
  status: MessageStatusType;
  className?: string;
}

/**
 * WhatsApp Message Status Indicator
 *
 * Displays checkmarks and icons to indicate message status:
 * - sending: Clock icon (gray)
 * - sent: Single checkmark (gray)
 * - delivered: Double checkmark (gray)
 * - read: Double checkmark (blue)
 * - failed: Alert icon (red)
 *
 * @see WhatsApp API v23.0 status specifications
 */
export default function MessageStatus({ status, className = '' }: MessageStatusProps) {
  const iconSize = 14;

  // Sending state - clock icon
  if (status === 'sending') {
    return (
      <Clock
        size={iconSize}
        className={className}
        style={{ color: WhatsAppColors.checkmarkGray }}
      />
    );
  }

  // Failed state - alert icon
  if (status === 'failed') {
    return (
      <AlertCircle
        size={iconSize}
        className={className}
        style={{ color: WhatsAppColors.error }}
      />
    );
  }

  // Sent state - single checkmark
  if (status === 'sent') {
    return (
      <Check
        size={iconSize}
        className={className}
        style={{ color: WhatsAppColors.checkmarkGray }}
      />
    );
  }

  // Delivered or Read state - double checkmark
  const color = status === 'read' ? WhatsAppColors.checkmarkBlue : WhatsAppColors.checkmarkGray;

  return (
    <div className={`relative inline-flex ${className}`} style={{ width: iconSize + 4, height: iconSize }}>
      {/* First checkmark */}
      <Check
        size={iconSize}
        className="absolute"
        style={{ color, left: '-2px', top: 0 }}
      />
      {/* Second checkmark (overlapping) */}
      <Check
        size={iconSize}
        className="absolute"
        style={{ color, left: '2px', top: 0 }}
      />
    </div>
  );
}
