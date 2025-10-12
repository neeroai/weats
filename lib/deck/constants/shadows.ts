/**
 * WhatsApp Official Shadow Specifications
 *
 * Box-shadow values for various UI elements
 * extracted from WhatsApp Web (web.whatsapp.com) inspection.
 *
 * @see https://web.whatsapp.com
 */

export const WhatsAppShadows = {
  // ==================== Message Bubbles ====================

  /**
   * Shadow for message bubbles
   * Subtle shadow for depth without being too prominent
   */
  bubble: '0 1px 0.5px rgba(11, 20, 26, 0.13)',

  /**
   * Shadow for message bubbles in dark mode
   */
  bubbleDark: '0 1px 0.5px rgba(0, 0, 0, 0.3)',

  // ==================== Interactive Elements ====================

  /**
   * Shadow for interactive buttons (reply buttons)
   * Slightly more elevated than regular bubbles
   */
  button: '0 1px 2px rgba(11, 20, 26, 0.08)',

  /**
   * Shadow for interactive buttons in dark mode
   */
  buttonDark: '0 1px 2px rgba(0, 0, 0, 0.2)',

  /**
   * Shadow for pressed/active buttons
   */
  buttonPressed: '0 1px 1px rgba(11, 20, 26, 0.12)',

  // ==================== Modal & Overlays ====================

  /**
   * Shadow for modal overlays (list selector, etc.)
   * More prominent shadow for elevated surfaces
   */
  modal: '0 2px 5px rgba(11, 20, 26, 0.26), 0 2px 10px rgba(11, 20, 26, 0.16)',

  /**
   * Shadow for modal overlays in dark mode
   */
  modalDark: '0 2px 5px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3)',

  // ==================== Header ====================

  /**
   * Shadow for chat header
   * Very subtle shadow for separation
   */
  header: '0 1px 0 rgba(11, 20, 26, 0.08)',

  /**
   * Shadow for header in dark mode
   */
  headerDark: '0 1px 0 rgba(0, 0, 0, 0.15)',

  // ==================== Input Area ====================

  /**
   * Shadow for input area
   * Subtle top shadow for separation from chat
   */
  input: '0 -1px 0 rgba(11, 20, 26, 0.08)',

  /**
   * Shadow for input area in dark mode
   */
  inputDark: '0 -1px 0 rgba(0, 0, 0, 0.15)',

  /**
   * Shadow for send button
   */
  sendButton: '0 1px 3px rgba(11, 20, 26, 0.15)',

  // ==================== Date Separator ====================

  /**
   * Shadow for date separator pill
   * Very subtle shadow for depth
   */
  dateSeparator: '0 1px 1px rgba(11, 20, 26, 0.08)',

  /**
   * Shadow for date separator in dark mode
   */
  dateSeparatorDark: '0 1px 1px rgba(0, 0, 0, 0.2)',

  // ==================== Media & Cards ====================

  /**
   * Shadow for media messages (images, videos)
   */
  media: '0 1px 1px rgba(11, 20, 26, 0.1)',

  /**
   * Shadow for cards (location cards, contact cards)
   */
  card: '0 1px 2px rgba(11, 20, 26, 0.1)',

  // ==================== Floating Elements ====================

  /**
   * Shadow for floating action button (scroll to bottom)
   */
  fab: '0 2px 4px rgba(11, 20, 26, 0.16), 0 1px 2px rgba(11, 20, 26, 0.08)',

  /**
   * Shadow for FAB in dark mode
   */
  fabDark: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',

  // ==================== Special Effects ====================

  /**
   * No shadow (for removing shadows)
   */
  none: 'none',

  /**
   * Focus ring for accessibility
   * Not a traditional shadow, but uses box-shadow
   */
  focus: '0 0 0 2px rgba(0, 128, 105, 0.3)',
} as const;

/**
 * Type helper for shadow keys
 */
export type WhatsAppShadowKey = keyof typeof WhatsAppShadows;

/**
 * Get shadow for light or dark mode
 * @param key - Base shadow key
 * @param isDark - Whether dark mode is active
 * @returns Shadow string
 */
export function getShadow(key: WhatsAppShadowKey, isDark: boolean = false): string {
  if (isDark) {
    const darkKey = `${key}Dark` as WhatsAppShadowKey;
    if (darkKey in WhatsAppShadows) {
      return WhatsAppShadows[darkKey];
    }
  }
  return WhatsAppShadows[key];
}
