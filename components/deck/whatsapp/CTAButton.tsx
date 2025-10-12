'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing, WhatsAppShadows } from '@/lib/deck/constants';

interface CTAButtonProps {
  displayText: string;
  url: string;
  delay?: number;
}

/**
 * WhatsApp Call-to-Action (CTA) Button Component
 *
 * Displays a button with external link icon for URLs
 * following official WhatsApp Business API v23.0 specifications.
 *
 * @see Used for tracking links, payment pages, external actions
 * @see Max 25 characters for display text
 * @see URL must be HTTPS
 * @see Style similar to reply buttons but with icon
 *
 * @example
 * <CTAButton
 *   displayText="Rastrea tu pedido"
 *   url="https://wpfoods.co/track/WPF-2845"
 * />
 */
export default function CTAButton({ displayText, url, delay = 0 }: CTAButtonProps) {
  // Enforce WhatsApp API limit of 25 characters
  const truncatedText = displayText.length > 25
    ? displayText.substring(0, 22) + '...'
    : displayText;

  // Warn if URL is not HTTPS
  const isValidUrl = url.startsWith('https://');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="my-2"
      style={{ maxWidth: WhatsAppSpacing.bubbleMaxWidth }}
    >
      {/* Wrapper Bubble */}
      <div
        className="p-3"
        style={{
          backgroundColor: WhatsAppColors.incomingBubble,
          borderRadius: WhatsAppSpacing.bubbleBorderRadius,
          boxShadow: WhatsAppShadows.bubble,
        }}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 no-underline"
          style={{
            backgroundColor: 'white',
            border: `${WhatsAppSpacing.buttonBorderWidth} solid ${WhatsAppColors.green}`,
            color: WhatsAppColors.linkBlue,
            borderRadius: WhatsAppSpacing.buttonBorderRadius,
            paddingLeft: WhatsAppSpacing.buttonPaddingHorizontal,
            paddingRight: WhatsAppSpacing.buttonPaddingHorizontal,
            paddingTop: WhatsAppSpacing.buttonPaddingVertical,
            paddingBottom: WhatsAppSpacing.buttonPaddingVertical,
            minHeight: WhatsAppSpacing.buttonMinHeight,
            fontSize: WhatsAppTypography.buttonText.fontSize,
            lineHeight: WhatsAppTypography.buttonText.lineHeight,
            fontWeight: WhatsAppTypography.buttonText.fontWeight,
            boxShadow: WhatsAppShadows.button,
          }}
        >
          <ExternalLink size={16} style={{ color: WhatsAppColors.linkBlue }} />
          <span>{truncatedText}</span>
        </a>
      </div>

      {/* Warnings in development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          {displayText.length > 25 && (
            <div className="text-xs text-orange-500 mt-1">
              Warning: Display text exceeds 25 characters. Truncated to: "{truncatedText}"
            </div>
          )}
          {!isValidUrl && (
            <div className="text-xs text-red-500 mt-1">
              Error: URL must use HTTPS protocol
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
