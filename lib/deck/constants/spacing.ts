/**
 * WhatsApp Official Spacing & Dimension Specifications
 *
 * Precise measurements for padding, margins, border-radius, and dimensions
 * extracted from WhatsApp Web (web.whatsapp.com) inspection.
 *
 * @see https://web.whatsapp.com
 */

export const WhatsAppSpacing = {
  // ==================== Chat Bubbles ====================

  /**
   * Horizontal padding inside message bubbles
   */
  bubblePaddingHorizontal: '12px',

  /**
   * Vertical padding inside message bubbles
   */
  bubblePaddingVertical: '6px',

  /**
   * Border radius for message bubbles
   * WhatsApp uses 7.5px specifically (not 8px)
   */
  bubbleBorderRadius: '7.5px',

  /**
   * Maximum width of message bubbles relative to container
   */
  bubbleMaxWidth: '65%',

  /**
   * Gap between consecutive bubbles from same sender
   */
  bubbleGap: '2px',

  /**
   * Gap between different bubble groups (different senders or time gaps)
   */
  bubbleGroupGap: '12px',

  /**
   * Bubble tail size (the little triangle pointer)
   */
  bubbleTailSize: '8px',

  // ==================== Header ====================

  /**
   * Fixed height of the chat header
   */
  headerHeight: '60px',

  /**
   * Horizontal padding in header
   */
  headerPaddingHorizontal: '16px',

  /**
   * Vertical padding in header
   */
  headerPaddingVertical: '10px',

  /**
   * Avatar/profile picture size in header
   */
  avatarSize: '40px',

  /**
   * Avatar border radius (circular)
   */
  avatarBorderRadius: '50%',

  /**
   * Gap between avatar and text in header
   */
  headerGap: '12px',

  /**
   * Gap between header icons
   */
  headerIconGap: '16px',

  /**
   * Header icon size
   */
  headerIconSize: '22px',

  // ==================== Input Area ====================

  /**
   * Fixed height of input area (message compose area)
   */
  inputHeight: '62px',

  /**
   * Horizontal padding in input area
   */
  inputPaddingHorizontal: '12px',

  /**
   * Vertical padding in input area
   */
  inputPaddingVertical: '9px',

  /**
   * Border radius for input field
   */
  inputBorderRadius: '21px',

  /**
   * Send button size (circular)
   */
  sendButtonSize: '42px',

  /**
   * Gap between input elements (emoji, attach, voice buttons)
   */
  inputElementGap: '8px',

  // ==================== Interactive Buttons ====================

  /**
   * Horizontal padding for reply buttons
   */
  buttonPaddingHorizontal: '16px',

  /**
   * Vertical padding for reply buttons
   */
  buttonPaddingVertical: '8px',

  /**
   * Border radius for reply buttons
   */
  buttonBorderRadius: '4px',

  /**
   * Gap between multiple buttons
   */
  buttonGap: '8px',

  /**
   * Border width for buttons
   */
  buttonBorderWidth: '1px',

  /**
   * Minimum button height
   */
  buttonMinHeight: '36px',

  // ==================== Interactive Lists ====================

  /**
   * Border radius for list action button (more rounded, pill-like)
   */
  listButtonBorderRadius: '22px',

  /**
   * Horizontal padding for list action button
   */
  listButtonPaddingHorizontal: '20px',

  /**
   * Vertical padding for list action button
   */
  listButtonPaddingVertical: '10px',

  /**
   * Horizontal padding for list items
   */
  listItemPaddingHorizontal: '20px',

  /**
   * Vertical padding for list items
   */
  listItemPaddingVertical: '12px',

  /**
   * Gap between list item title and description
   */
  listItemGap: '4px',

  /**
   * List modal border radius
   */
  listModalBorderRadius: '12px',

  // ==================== Location Messages ====================

  /**
   * Height of location map preview
   */
  locationMapHeight: '120px',

  /**
   * Maximum width of location map
   */
  locationMapMaxWidth: '240px',

  /**
   * Horizontal padding for location info section
   */
  locationInfoPaddingHorizontal: '12px',

  /**
   * Vertical padding for location info section
   */
  locationInfoPaddingVertical: '8px',

  /**
   * Location pin icon size
   */
  locationPinSize: '24px',

  // ==================== Date Separator ====================

  /**
   * Horizontal padding for date separator pill
   */
  dateSeparatorPaddingHorizontal: '12px',

  /**
   * Vertical padding for date separator pill
   */
  dateSeparatorPaddingVertical: '5px',

  /**
   * Border radius for date separator
   */
  dateSeparatorBorderRadius: '7.5px',

  /**
   * Margin around date separator
   */
  dateSeparatorMargin: '12px',

  // ==================== Media Messages ====================

  /**
   * Border radius for image/video messages
   */
  mediaBorderRadius: '7.5px',

  /**
   * Maximum width for media in messages
   */
  mediaMaxWidth: '330px',

  /**
   * Maximum height for media in messages
   */
  mediaMaxHeight: '330px',

  /**
   * Padding for media caption
   */
  mediaCaptionPadding: '8px',

  // ==================== Typing Indicator ====================

  /**
   * Dot size for typing indicator
   */
  typingDotSize: '6px',

  /**
   * Gap between typing dots
   */
  typingDotGap: '4px',

  /**
   * Padding around typing indicator
   */
  typingIndicatorPadding: '8px 12px',

  // ==================== Status Icons ====================

  /**
   * Size of checkmark icons
   */
  checkmarkSize: '14px',

  /**
   * Gap between checkmarks in double-check
   */
  checkmarkGap: '2px',

  /**
   * Size of status icons (clock, alert)
   */
  statusIconSize: '14px',
} as const;

/**
 * Type helper for spacing keys
 */
export type WhatsAppSpacingKey = keyof typeof WhatsAppSpacing;

/**
 * Convert spacing value to number (removes 'px')
 * @param key - The spacing key
 * @returns Numeric value
 */
export function getSpacingValue(key: WhatsAppSpacingKey): number {
  const value = WhatsAppSpacing[key];
  if (typeof value === 'string' && value.endsWith('px')) {
    return parseInt(value, 10);
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    return parseInt(value, 10);
  }
  return 0;
}
