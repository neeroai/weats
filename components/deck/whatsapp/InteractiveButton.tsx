'use client';

import { motion } from 'framer-motion';
import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing, WhatsAppShadows } from '@/lib/deck/constants';

interface InteractiveButtonProps {
  buttons: { id: string; title: string; disabled?: boolean }[];
  delay?: number;
}

/**
 * WhatsApp Interactive Reply Buttons
 *
 * Pixel-perfect implementation of WhatsApp Business API v23.0 reply buttons.
 *
 * @see Max 3 buttons allowed (WhatsApp API limit)
 * @see Text color: #027EB5 (link blue, NOT green)
 * @see Border: 1px, NOT 2px
 * @see Border radius: 4px, NOT rounded-full
 * @see NO hover effects (mobile touch interface)
 */
export default function InteractiveButton({
  buttons,
  delay = 0,
}: InteractiveButtonProps) {
  // Enforce WhatsApp API limit of max 3 buttons
  const limitedButtons = buttons.slice(0, 3);

  if (limitedButtons.length === 0) {
    return null;
  }

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
        <div
          className="flex flex-col"
          style={{ gap: WhatsAppSpacing.buttonGap }}
        >
          {limitedButtons.map((button, index) => (
            <motion.button
              key={button.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: delay + index * 0.05 }}
              disabled={button.disabled}
              className="text-left"
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
                opacity: button.disabled ? 0.5 : 1,
                cursor: button.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {button.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Warning if more than 3 buttons provided */}
      {buttons.length > 3 && process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-red-500 mt-1">
          Warning: WhatsApp API allows max 3 reply buttons. Showing first 3 only.
        </div>
      )}
    </motion.div>
  );
}
