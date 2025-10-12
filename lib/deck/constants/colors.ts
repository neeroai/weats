/**
 * WhatsApp Official Color Palette (2021+)
 *
 * Based on WhatsApp Cloud API v23.0 UI specifications.
 * Updated colors reflect the 2021-2022 redesign.
 *
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api
 * @see WhatsApp Web inspection at https://web.whatsapp.com
 */

export const WhatsAppColors = {
  // ==================== Primary Colors ====================

  /**
   * Main teal color for headers and primary actions
   * Updated in 2021 redesign (was #128C7E in pre-2021)
   */
  tealDark: '#008069',

  /**
   * Lighter teal for accent elements
   */
  tealLight: '#00A884',

  /**
   * WhatsApp signature green for send buttons and action elements
   */
  green: '#25D366',

  /**
   * Outgoing message bubble background
   * Updated in 2021 redesign (was #DCF8C6 in pre-2021)
   */
  greenLight: '#D9FDD3',

  // ==================== Text Colors ====================

  /**
   * Primary text color for message content
   * Light mode: #111B21
   * Dark mode: #E9EDEF
   */
  primary: '#111B21',

  /**
   * Secondary text for timestamps, metadata
   */
  secondary: '#667781',

  /**
   * Tertiary text for placeholders and disabled states
   */
  tertiary: '#8696A0',

  // ==================== Background Colors ====================

  /**
   * Main app background
   */
  background: '#FFFFFF',

  /**
   * Secondary surfaces (input area, cards)
   */
  backgroundSecondary: '#F0F2F5',

  /**
   * Chat area background (light mode)
   * Uses subtle pattern texture in production
   */
  chatBackground: '#EFEAE2',

  /**
   * Chat area background (dark mode)
   */
  chatBackgroundDark: '#0B141A',

  // ==================== Interactive Elements ====================

  /**
   * Link color and interactive button text
   * Used for reply buttons, list buttons, CTAs
   */
  linkBlue: '#027EB5',

  /**
   * Read checkmark color (double check blue)
   */
  checkmarkBlue: '#53BDEB',

  /**
   * Delivered/sent checkmark color (double check gray)
   */
  checkmarkGray: '#919191',

  // ==================== Borders & Dividers ====================

  /**
   * Standard border color for dividers, separators
   */
  border: '#E9EDEF',

  /**
   * Dark mode border color
   */
  borderDark: '#8696A0',

  // ==================== Status Colors ====================

  /**
   * Online status indicator
   */
  online: '#25D366',

  /**
   * Offline/last seen text
   */
  offline: '#667781',

  /**
   * Error states and failed messages
   */
  error: '#EA4335',

  /**
   * Warning states
   */
  warning: '#FFA000',

  // ==================== Message Bubbles ====================

  /**
   * Incoming message bubble background
   */
  incomingBubble: '#FFFFFF',

  /**
   * Outgoing message bubble background
   * Same as greenLight for consistency
   */
  outgoingBubble: '#D9FDD3',
} as const;

/**
 * Type helper for color keys
 */
export type WhatsAppColorKey = keyof typeof WhatsAppColors;

/**
 * Dark mode color palette
 * Use this when implementing dark mode toggle
 */
export const WhatsAppColorsDark = {
  ...WhatsAppColors,
  primary: '#E9EDEF',
  secondary: '#8696A0',
  tertiary: '#667781',
  background: '#111B21',
  backgroundSecondary: '#202C33',
  chatBackground: '#0B141A',
  incomingBubble: '#202C33',
  outgoingBubble: '#005C4B',
  border: '#2A3942',
} as const;
