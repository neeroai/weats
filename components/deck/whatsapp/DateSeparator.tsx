'use client';

import { motion } from 'framer-motion';
import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing, WhatsAppShadows } from '@/lib/deck/constants';

interface DateSeparatorProps {
  date: Date | string;
  delay?: number;
}

/**
 * WhatsApp Date Separator Component
 *
 * Displays centered date pills like "Hoy 6:15 PM", "Ayer", or "10 Octubre 2025"
 * following official WhatsApp Business API v23.0 specifications.
 *
 * @see Background: #E9EDEF (light pill)
 * @see Border radius: 7.5px
 * @see Padding: 12px horizontal, 5px vertical
 * @see Font: 12px, medium weight
 */
export default function DateSeparator({ date, delay = 0 }: DateSeparatorProps) {
  const formattedDate = formatWhatsAppDate(date);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="flex justify-center"
      style={{ margin: `${WhatsAppSpacing.dateSeparatorMargin} 0` }}
    >
      <div
        className="inline-flex items-center justify-center"
        style={{
          backgroundColor: WhatsAppColors.backgroundSecondary,
          borderRadius: WhatsAppSpacing.dateSeparatorBorderRadius,
          paddingLeft: WhatsAppSpacing.dateSeparatorPaddingHorizontal,
          paddingRight: WhatsAppSpacing.dateSeparatorPaddingHorizontal,
          paddingTop: WhatsAppSpacing.dateSeparatorPaddingVertical,
          paddingBottom: WhatsAppSpacing.dateSeparatorPaddingVertical,
          fontSize: WhatsAppTypography.dateSeparator.fontSize,
          lineHeight: WhatsAppTypography.dateSeparator.lineHeight,
          fontWeight: WhatsAppTypography.dateSeparator.fontWeight,
          color: WhatsAppColors.secondary,
          boxShadow: WhatsAppShadows.dateSeparator,
        }}
      >
        {formattedDate}
      </div>
    </motion.div>
  );
}

/**
 * Format date like WhatsApp:
 * - Today → "Hoy"
 * - Yesterday → "Ayer"
 * - This week → Day name (e.g., "Lunes")
 * - Older → Full date (e.g., "10 Octubre 2025")
 */
function formatWhatsAppDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

  const diffTime = today.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Today
  if (diffDays === 0) {
    return 'Hoy';
  }

  // Yesterday
  if (diffDays === 1) {
    return 'Ayer';
  }

  // This week (last 7 days)
  if (diffDays < 7) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dayNames[dateObj.getDay()];
  }

  // Older dates
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const day = dateObj.getDate();
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  // Same year → "10 Octubre"
  if (year === now.getFullYear()) {
    return `${day} ${month}`;
  }

  // Different year → "10 Octubre 2025"
  return `${day} ${month} ${year}`;
}
