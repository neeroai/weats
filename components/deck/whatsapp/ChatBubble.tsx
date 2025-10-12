'use client';

import { motion } from 'framer-motion';
import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing, WhatsAppShadows } from '@/lib/deck/constants';
import MessageStatus, { type MessageStatusType } from './MessageStatus';

interface ChatBubbleProps {
  sender: 'customer' | 'wpfoods';
  message: string;
  timestamp: string;
  delay?: number;
  status?: MessageStatusType;
  showTail?: boolean;
}

/**
 * WhatsApp Chat Bubble Component
 *
 * Pixel-perfect implementation of WhatsApp message bubbles
 * following official WhatsApp Business API v23.0 specifications.
 *
 * @see WhatsApp colors updated to 2021+ palette (#D9FDD3, not #DCF8C6)
 * @see Border radius: 7.5px (official spec, not 8px)
 * @see Padding: 12px horizontal, 6px vertical
 * @see Max width: 65% of container
 */
export default function ChatBubble({
  sender,
  message,
  timestamp,
  delay = 0,
  status = 'read',
  showTail = false,
}: ChatBubbleProps) {
  const isCustomer = sender === 'customer';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
      style={{ marginBottom: WhatsAppSpacing.bubbleGap }}
    >
      <div
        className="relative"
        style={{ maxWidth: WhatsAppSpacing.bubbleMaxWidth }}
      >
        {/* Bubble Tail (triangle pointer) */}
        {showTail && (
          <div
            className="absolute bottom-0"
            style={{
              [isCustomer ? 'right' : 'left']: '-8px',
              width: 0,
              height: 0,
              borderLeft: isCustomer ? `8px solid ${WhatsAppColors.outgoingBubble}` : 'none',
              borderRight: !isCustomer ? `8px solid ${WhatsAppColors.incomingBubble}` : 'none',
              borderBottom: '8px solid transparent',
            }}
          />
        )}

        {/* Message Bubble */}
        <div
          className="px-[12px] py-[6px] whitespace-pre-wrap"
          style={{
            backgroundColor: isCustomer
              ? WhatsAppColors.outgoingBubble
              : WhatsAppColors.incomingBubble,
            borderRadius: WhatsAppSpacing.bubbleBorderRadius,
            boxShadow: WhatsAppShadows.bubble,
            fontFamily: WhatsAppTypography.fontFamily,
            fontSize: WhatsAppTypography.messageBody.fontSize,
            lineHeight: WhatsAppTypography.messageBody.lineHeight,
            fontWeight: WhatsAppTypography.messageBody.fontWeight,
            letterSpacing: WhatsAppTypography.messageBody.letterSpacing,
            color: WhatsAppColors.primary,
          }}
        >
          {message}
        </div>

        {/* Timestamp + Status */}
        <div
          className={`flex items-center gap-1 mt-1 ${
            isCustomer ? 'justify-end' : 'justify-start'
          }`}
        >
          <span
            style={{
              fontSize: WhatsAppTypography.timestamp.fontSize,
              lineHeight: WhatsAppTypography.timestamp.lineHeight,
              fontWeight: WhatsAppTypography.timestamp.fontWeight,
              color: WhatsAppColors.secondary,
            }}
          >
            {timestamp}
          </span>
          {isCustomer && <MessageStatus status={status} />}
        </div>
      </div>
    </motion.div>
  );
}
