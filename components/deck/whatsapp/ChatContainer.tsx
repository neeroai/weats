'use client';

import { ChevronLeft, Phone, Video, MoreVertical } from 'lucide-react';
import { WhatsAppColors, WhatsAppTypography, WhatsAppSpacing, WhatsAppShadows } from '@/lib/deck/constants';

interface ChatContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isTyping?: boolean;
}

/**
 * WhatsApp Chat Container Component
 *
 * Pixel-perfect WhatsApp UI with header, chat area, and input section
 * following official WhatsApp Business API v23.0 specifications.
 *
 * @see Header background: #008069 (2021+ color, was #128C7E)
 * @see Header height: 60px fixed
 * @see Chat background: #EFEAE2 (light mode)
 * @see Input area: #F0F2F5 (secondary background)
 */
export default function ChatContainer({
  children,
  title = 'WPFoods',
  subtitle = 'Online',
  isTyping = false,
}: ChatContainerProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* WhatsApp Header */}
      <div
        className="flex items-center justify-between"
        style={{
          backgroundColor: WhatsAppColors.tealDark,
          height: WhatsAppSpacing.headerHeight,
          paddingLeft: WhatsAppSpacing.headerPaddingHorizontal,
          paddingRight: WhatsAppSpacing.headerPaddingHorizontal,
          boxShadow: WhatsAppShadows.header,
        }}
      >
        <div
          className="flex items-center flex-1"
          style={{ gap: WhatsAppSpacing.headerGap }}
        >
          <ChevronLeft
            style={{
              width: WhatsAppSpacing.headerIconSize,
              height: WhatsAppSpacing.headerIconSize,
              color: 'white',
            }}
          />

          {/* Avatar */}
          <div
            className="flex items-center justify-center font-medium"
            style={{
              width: WhatsAppSpacing.avatarSize,
              height: WhatsAppSpacing.avatarSize,
              borderRadius: WhatsAppSpacing.avatarBorderRadius,
              backgroundColor: WhatsAppColors.secondary,
              color: 'white',
              fontSize: '16px',
            }}
          >
            WP
          </div>

          {/* Title & Subtitle */}
          <div className="flex-1">
            <div
              style={{
                fontSize: WhatsAppTypography.headerTitle.fontSize,
                lineHeight: WhatsAppTypography.headerTitle.lineHeight,
                fontWeight: WhatsAppTypography.headerTitle.fontWeight,
                color: 'white',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: WhatsAppTypography.headerSubtitle.fontSize,
                lineHeight: WhatsAppTypography.headerSubtitle.lineHeight,
                fontWeight: WhatsAppTypography.headerSubtitle.fontWeight,
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              {isTyping ? 'typing...' : subtitle}
            </div>
          </div>
        </div>

        {/* Header Icons */}
        <div
          className="flex items-center"
          style={{ gap: WhatsAppSpacing.headerIconGap }}
        >
          <Video
            style={{
              width: WhatsAppSpacing.headerIconSize,
              height: WhatsAppSpacing.headerIconSize,
              color: 'white',
            }}
          />
          <Phone
            style={{
              width: WhatsAppSpacing.headerIconSize,
              height: WhatsAppSpacing.headerIconSize,
              color: 'white',
            }}
          />
          <MoreVertical
            style={{
              width: WhatsAppSpacing.headerIconSize,
              height: WhatsAppSpacing.headerIconSize,
              color: 'white',
            }}
          />
        </div>
      </div>

      {/* Chat Area */}
      <div
        className="p-4 space-y-2 overflow-y-auto"
        style={{
          minHeight: '400px',
          maxHeight: '500px',
          backgroundColor: WhatsAppColors.chatBackground,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4ccba' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {children}
      </div>

      {/* Input Area (visual only) */}
      <div
        className="flex items-center border-t"
        style={{
          backgroundColor: WhatsAppColors.backgroundSecondary,
          borderColor: WhatsAppColors.border,
          height: WhatsAppSpacing.inputHeight,
          paddingLeft: WhatsAppSpacing.inputPaddingHorizontal,
          paddingRight: WhatsAppSpacing.inputPaddingHorizontal,
          gap: WhatsAppSpacing.inputElementGap,
          boxShadow: WhatsAppShadows.input,
        }}
      >
        {/* Input Field */}
        <div
          className="flex-1"
          style={{
            backgroundColor: 'white',
            borderRadius: WhatsAppSpacing.inputBorderRadius,
            paddingLeft: WhatsAppSpacing.inputPaddingHorizontal,
            paddingRight: WhatsAppSpacing.inputPaddingHorizontal,
            paddingTop: WhatsAppSpacing.inputPaddingVertical,
            paddingBottom: WhatsAppSpacing.inputPaddingVertical,
            fontSize: WhatsAppTypography.inputPlaceholder.fontSize,
            lineHeight: WhatsAppTypography.inputPlaceholder.lineHeight,
            color: WhatsAppTypography.inputPlaceholder.color,
            border: `1px solid ${WhatsAppColors.border}`,
          }}
        >
          Type a message
        </div>

        {/* Send Button */}
        <div
          className="flex items-center justify-center"
          style={{
            width: WhatsAppSpacing.sendButtonSize,
            height: WhatsAppSpacing.sendButtonSize,
            backgroundColor: WhatsAppColors.green,
            borderRadius: '50%',
            boxShadow: WhatsAppShadows.sendButton,
          }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
