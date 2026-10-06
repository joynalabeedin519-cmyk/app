export interface PosterConfig {
  // Images
  leftImageSrc: string | null;
  rightImageSrc: string | null;
  leftImageScale: number; // 0.5 to 3
  leftImageOffsetX: number; // percentage or px
  leftImageOffsetY: number;
  rightImageScale: number;
  rightImageOffsetX: number;
  rightImageOffsetY: number;
  imageCornerRadius?: number; // 0 to 60px for soft/round/circular corners

  // Banner text
  bannerReasonText: string; // e.g. "প্রতিনিয়ত হ্যা,রেস,মেন্ট করার অ,প,রা,ধে"
  bannerActionText: string; // e.g. "একটি আইডি রি,মু,ভ করা হলো"
  bannerTeamText: string;   // e.g. "TEAM CSB"
  bannerFooterText: string; // e.g. "পক্ষ থেকে।"
  
  // Custom freeform text mode
  useFreeformBanner: boolean;
  freeformText: string;

  // Banner styling
  bannerBgColor: string; // default #ffffff
  bannerBorderColor: string; // default #dc2626
  bannerBorderWidth: number; // default 10
  bannerCornerRadius: number; // default 24
  bannerTextColor: string; // default #000000
  bannerTeamColor: string; // default #dc2626
  bannerLine1Color?: string; // default #000000
  bannerLine2Color?: string; // default #000000
  bannerLine3Color?: string; // default #000000
  bannerFontSize: number; // text font size scale multiplier, default 1
  bannerHeightScale: number; // banner height scale multiplier, default 1
  bannerFontFamily?: string; // default 'Hind Siliguri'
  bannerFontWeight?: string; // default '800'
  bannerBottomMargin: number; // px from bottom

  // Outer border & frame
  outerBorderColor: string; // default #dc2626
  outerBorderWidth: number; // default 12
  frameCornerRadius: number; // default 28
  dividerColor: string; // default #dc2626
  dividerWidth: number; // default 8
  canvasBgColor: string; // default #021a1f

  // Watermark Emblem
  showEmblem: boolean;
  emblemOpacity: number; // 0 to 1, default 0.88
  emblemScale: number; // 0.5 to 2, default 1.05
  emblemOffsetY: number; // -100 to 100, default 0
  emblemBlendMode: 'normal' | 'screen' | 'lighten';
  emblemRemoveOuterWhite: boolean;
  emblemRemoveDarkBg: boolean;
  emblemDarkThreshold: number;
  watermarkTitle: string; // default "CYBER SENTINEL"
  watermarkSubtitle: string; // default "BANGLADESH"
  watermarkTitleColor: string; // default #a5f3fc
  watermarkSubtitleColor: string; // default #f87171
  customEmblemSrc: string | null;
  processedCustomEmblemSrc: string | null;

  // Output
  resolution: 1080 | 1440 | 2048;
}

export interface PresetTemplate {
  id: string;
  name: string;
  nameBn: string;
  freeformText: string;
  reasonText?: string;
  actionText?: string;
  teamText?: string;
  footerText?: string;
}

export interface SavedPosterProject {
  id: string;
  name: string;
  timestamp: number;
  dateFormatted: string;
  thumbnailUrl?: string;
  config: PosterConfig;
}

