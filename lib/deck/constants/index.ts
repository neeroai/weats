/**
 * WhatsApp Design System Constants
 *
 * Central export for all WhatsApp UI specifications.
 * Import from this file to ensure consistency across components.
 *
 * @example
 * ```ts
 * import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing } from '@/lib/constants';
 * ```
 */

export { WhatsAppColors, WhatsAppColorsDark, type WhatsAppColorKey } from './colors';
export {
  WhatsAppTypography,
  fontFamily,
  getTypographyStyle,
  type WhatsAppTypographyKey,
} from './typography';
export { WhatsAppSpacing, getSpacingValue, type WhatsAppSpacingKey } from './spacing';
export { WhatsAppShadows, getShadow, type WhatsAppShadowKey } from './shadows';
