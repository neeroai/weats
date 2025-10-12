/**
 * WhatsApp Official Typography Specifications
 *
 * Font sizes, line heights, weights, and letter spacing
 * extracted from WhatsApp Web (web.whatsapp.com) inspection.
 *
 * @see https://web.whatsapp.com
 */

/**
 * System font stack used by WhatsApp
 * Prioritizes native system fonts for best rendering
 */
export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, Roboto, sans-serif';

export const WhatsAppTypography = {
  /**
   * Base font family for all WhatsApp UI
   */
  fontFamily,

  // ==================== Message Text ====================

  /**
   * Primary message body text
   * Used for: Chat message content
   */
  messageBody: {
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },

  /**
   * Message caption (for media messages)
   * Used for: Image/video captions
   */
  messageCaption: {
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },

  // ==================== Timestamps & Metadata ====================

  /**
   * Message timestamp
   * Used for: Time indicators on messages
   */
  timestamp: {
    fontSize: '11px',
    lineHeight: '15px',
    fontWeight: 400,
    letterSpacing: '0',
  },

  /**
   * Date separator text
   * Used for: "Today", "Yesterday", date labels
   */
  dateSeparator: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 500,
    letterSpacing: '0',
  },

  // ==================== Contact & Header ====================

  /**
   * Contact name in group messages
   * Used for: Sender name above message in groups
   */
  contactName: {
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: 500,
    letterSpacing: '0',
  },

  /**
   * Header title (chat name)
   * Used for: Contact/group name in header
   */
  headerTitle: {
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 500,
    letterSpacing: '0',
  },

  /**
   * Header subtitle (online status, last seen)
   * Used for: "Online", "typing...", "last seen at..."
   */
  headerSubtitle: {
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: 400,
    letterSpacing: '0',
  },

  // ==================== Interactive Elements ====================

  /**
   * Button text (reply buttons, quick replies)
   * Used for: Interactive button labels
   */
  buttonText: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400, // NOT bold in WhatsApp
    letterSpacing: '0',
  },

  /**
   * List button text (main action button)
   * Used for: "Ver Opciones", "Select" buttons
   */
  listButtonText: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600, // Semibold for list buttons
    letterSpacing: '0',
  },

  /**
   * List item title
   * Used for: List option titles
   */
  listItemTitle: {
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: 400,
    letterSpacing: '0',
  },

  /**
   * List item description
   * Used for: List option descriptions
   */
  listItemDescription: {
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 400,
    letterSpacing: '0',
    color: '#667781', // Secondary text color
  },

  // ==================== Input ====================

  /**
   * Input field text
   * Used for: Message input box
   */
  inputText: {
    fontSize: '15px',
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0',
  },

  /**
   * Input placeholder
   * Used for: "Type a message" placeholder
   */
  inputPlaceholder: {
    fontSize: '15px',
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0',
    color: '#667781', // Secondary text color
  },

  // ==================== System Messages ====================

  /**
   * System message text
   * Used for: "Messages to this chat are secured with end-to-end encryption"
   */
  systemMessage: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0',
    color: '#667781',
  },

  /**
   * Forwarded label
   * Used for: "Forwarded" indicator
   */
  forwardedLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    letterSpacing: '0',
    fontStyle: 'italic',
  },
} as const;

/**
 * Type helper for typography keys
 */
export type WhatsAppTypographyKey = keyof typeof WhatsAppTypography;

/**
 * Utility function to apply typography styles
 * @param key - The typography style key
 * @returns CSS-in-JS style object
 */
export function getTypographyStyle(key: WhatsAppTypographyKey) {
  const style = WhatsAppTypography[key];
  if (typeof style === 'string') {
    return { fontFamily: style };
  }
  return style;
}
