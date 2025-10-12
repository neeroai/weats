'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing, WhatsAppShadows } from '@/lib/deck/constants';

interface ListItem {
  id: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

interface InteractiveListProps {
  items: ListItem[];
  buttonText?: string;
  delay?: number;
}

/**
 * WhatsApp Interactive List Component
 *
 * Pixel-perfect implementation of WhatsApp Business API v23.0 list messages.
 *
 * @see Button style: Solid green background (#25D366), white text
 * @see Border radius: 22px (pill style)
 * @see Font weight: Semibold (600) for button
 * @see NO chevron icon in button (WhatsApp doesn't use it)
 * @see Max 10 items per section (WhatsApp API limit)
 * @see In production, would open fullscreen modal overlay
 */
export default function InteractiveList({
  items,
  buttonText = 'Ver Opciones',
  delay = 0,
}: InteractiveListProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Enforce WhatsApp API limit of max 10 items
  const limitedItems = items.slice(0, 10);

  if (limitedItems.length === 0) {
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
      {/* List Action Button (Green pill) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-center"
        style={{
          backgroundColor: WhatsAppColors.green,
          color: 'white',
          borderRadius: WhatsAppSpacing.listButtonBorderRadius,
          paddingLeft: WhatsAppSpacing.listButtonPaddingHorizontal,
          paddingRight: WhatsAppSpacing.listButtonPaddingHorizontal,
          paddingTop: WhatsAppSpacing.listButtonPaddingVertical,
          paddingBottom: WhatsAppSpacing.listButtonPaddingVertical,
          fontSize: WhatsAppTypography.listButtonText.fontSize,
          lineHeight: WhatsAppTypography.listButtonText.lineHeight,
          fontWeight: WhatsAppTypography.listButtonText.fontWeight,
          boxShadow: WhatsAppShadows.button,
        }}
      >
        {buttonText}
      </motion.button>

      {/* List Items (Expandable - simulates modal) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-2 overflow-hidden"
            style={{
              backgroundColor: WhatsAppColors.incomingBubble,
              borderRadius: WhatsAppSpacing.listModalBorderRadius,
              boxShadow: WhatsAppShadows.modal,
            }}
          >
            {limitedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="cursor-pointer"
                style={{
                  paddingLeft: WhatsAppSpacing.listItemPaddingHorizontal,
                  paddingRight: WhatsAppSpacing.listItemPaddingHorizontal,
                  paddingTop: WhatsAppSpacing.listItemPaddingVertical,
                  paddingBottom: WhatsAppSpacing.listItemPaddingVertical,
                  borderBottom: index !== limitedItems.length - 1 ? `1px solid ${WhatsAppColors.border}` : 'none',
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                {/* Item Title */}
                <div
                  style={{
                    fontSize: WhatsAppTypography.listItemTitle.fontSize,
                    lineHeight: WhatsAppTypography.listItemTitle.lineHeight,
                    fontWeight: WhatsAppTypography.listItemTitle.fontWeight,
                    color: WhatsAppColors.primary,
                  }}
                >
                  {item.title}
                </div>

                {/* Item Description (optional) */}
                {item.description && (
                  <div
                    className="mt-1"
                    style={{
                      fontSize: WhatsAppTypography.listItemDescription.fontSize,
                      lineHeight: WhatsAppTypography.listItemDescription.lineHeight,
                      fontWeight: WhatsAppTypography.listItemDescription.fontWeight,
                      color: WhatsAppTypography.listItemDescription.color,
                    }}
                  >
                    {item.description}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning if more than 10 items provided */}
      {items.length > 10 && process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-red-500 mt-1">
          Warning: WhatsApp API allows max 10 list items. Showing first 10 only.
        </div>
      )}
    </motion.div>
  );
}
