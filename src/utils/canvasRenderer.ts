import { PosterConfig } from '../types/poster';
import { generateEmblemSvg } from './emblemSvg';

// Image cache to avoid re-decoding SVGs and data URLs on every frame
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src)!);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = src;
  });
}

export interface TextToken {
  text: string;
  color: string;
  font?: string;
}

export function parseFormattedText(
  rawText: string,
  defaultColor: string,
  customFont?: string
): TextToken[] {
  const regex = /\[color:([^\]]+)\]([\s\S]*?)\[\/color\]/g;
  const tokens: TextToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: rawText.substring(lastIndex, match.index),
        color: defaultColor,
        font: customFont,
      });
    }
    tokens.push({
      text: match[2],
      color: match[1],
      font: customFont,
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < rawText.length) {
    tokens.push({
      text: rawText.substring(lastIndex),
      color: defaultColor,
      font: customFont,
    });
  }

  return tokens.filter((t) => t.text.length > 0);
}

function drawFormattedTokens(
  ctx: CanvasRenderingContext2D,
  tokens: TextToken[],
  centerX: number,
  y: number,
  defaultFont: string
) {
  let totalWidth = 0;
  for (const token of tokens) {
    ctx.font = token.font || defaultFont;
    totalWidth += ctx.measureText(token.text).width;
  }

  let currentX = centerX - totalWidth / 2;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  for (const token of tokens) {
    ctx.font = token.font || defaultFont;
    ctx.fillStyle = token.color;
    ctx.fillText(token.text, currentX, y);
    currentX += ctx.measureText(token.text).width;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

/**
 * Renders the consolidated Cyber Sentinel Bangladesh poster to a canvas.
 */
export async function renderPoster(
  canvas: HTMLCanvasElement,
  config: PosterConfig,
  targetResolution?: number
): Promise<void> {
  const size = targetResolution || config.resolution || 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Scale factor relative to 1080 baseline
  const scale = size / 1080;

  // 1. Draw Overall Background
  // Deep dark cyan / slate gradient matching outer frame background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, size);
  bgGrad.addColorStop(0, '#001a22');
  bgGrad.addColorStop(0.5, '#022c35');
  bgGrad.addColorStop(1, '#001319');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Subtle cyan grid lines
  ctx.save();
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 1 * scale;
  const gridSize = 40 * scale;
  for (let x = 0; x <= size; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  ctx.restore();

  // Outer framing dimensions
  const outerMargin = 16 * scale;
  const frameX = outerMargin;
  const frameY = outerMargin;
  const frameW = size - outerMargin * 2;
  
  // Banner height calculation (at bottom) - independent from text size
  const bannerMarginBottom = (config.bannerBottomMargin || 18) * scale;
  const bannerH = 195 * scale * (config.bannerHeightScale || 1);
  const bannerY = size - bannerMarginBottom - bannerH;
  
  // Split Screen Area: occupies from top frame down to banner top (with gap)
  const splitScreenGap = 16 * scale;
  const splitScreenH = bannerY - frameY - splitScreenGap;
  const splitRadius = (config.frameCornerRadius || 24) * scale;
  const redFrameBorderWidth = (config.outerBorderWidth || 12) * scale;
  const halfW = frameW / 2;
  const dividerW = (config.dividerWidth || 8) * scale;

  // ==========================================
  // 2. Draw Left Half Screen [Image 1]
  // ==========================================
  ctx.save();
  const leftX = frameX;
  const leftY = frameY;
  const leftW = halfW - dividerW / 2;
  const leftH = splitScreenH;
  const userImgRadius = (config.imageCornerRadius ?? 0) * scale;
  const effectiveLeftRadius = userImgRadius > 0 ? userImgRadius : splitRadius;

  if (userImgRadius > 0) {
    // All 4 corners rounded for soft/circular card effect
    roundRect(ctx, leftX, leftY, leftW, leftH, effectiveLeftRadius);
    ctx.clip();
  } else {
    // Clip left half with rounded corners on left side
    ctx.beginPath();
    ctx.moveTo(leftX + splitRadius, leftY);
    ctx.lineTo(leftX + leftW, leftY);
    ctx.lineTo(leftX + leftW, leftY + leftH);
    ctx.lineTo(leftX + splitRadius, leftY + leftH);
    ctx.arcTo(leftX, leftY + leftH, leftX, leftY, splitRadius);
    ctx.arcTo(leftX, leftY, leftX + leftW, leftY, splitRadius);
    ctx.closePath();
    ctx.clip();
  }

  // Background for left half (white default for screenshot)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(leftX, leftY, leftW, leftH);

  if (config.leftImageSrc) {
    try {
      const leftImg = await loadImage(config.leftImageSrc);
      // Calculate drawing with zoom & offset
      const zoom = config.leftImageScale || 1;
      const aspect = leftImg.width / leftImg.height;
      const targetAspect = leftW / leftH;

      let drawW: number;
      let drawH: number;
      if (aspect < targetAspect) {
        drawW = leftW * zoom;
        drawH = (leftW / aspect) * zoom;
      } else {
        drawH = leftH * zoom;
        drawW = (leftH * aspect) * zoom;
      }

      const drawX = leftX + (leftW - drawW) / 2 + (config.leftImageOffsetX || 0) * scale;
      const drawY = leftY + (leftH - drawH) / 2 + (config.leftImageOffsetY || 0) * scale;

      ctx.drawImage(leftImg, drawX, drawY, drawW, drawH);
    } catch {
      // Image failed to load, draw placeholder
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(leftX, leftY, leftW, leftH);
    }
  }
  ctx.restore();

  // ==========================================
  // 3. Draw Right Half Screen [Image 2]
  // ==========================================
  ctx.save();
  const rightX = frameX + halfW + dividerW / 2;
  const rightY = frameY;
  const rightW = halfW - dividerW / 2;
  const rightH = splitScreenH;

  const effectiveRightRadius = userImgRadius > 0 ? userImgRadius : splitRadius;

  if (userImgRadius > 0) {
    // All 4 corners rounded for soft/circular card effect
    roundRect(ctx, rightX, rightY, rightW, rightH, effectiveRightRadius);
    ctx.clip();
  } else {
    // Clip right half with rounded corners on right side
    ctx.beginPath();
    ctx.moveTo(rightX, rightY);
    ctx.lineTo(rightX + rightW - splitRadius, rightY);
    ctx.arcTo(rightX + rightW, rightY, rightX + rightW, rightY + rightH, splitRadius);
    ctx.arcTo(rightX + rightW, rightY + rightH, rightX, rightY + rightH, splitRadius);
    ctx.lineTo(rightX, rightY + rightH);
    ctx.closePath();
    ctx.clip();
  }

  // Background for right half
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(rightX, rightY, rightW, rightH);

  if (config.rightImageSrc) {
    try {
      const rightImg = await loadImage(config.rightImageSrc);
      const zoom = config.rightImageScale || 1;
      const aspect = rightImg.width / rightImg.height;
      const targetAspect = rightW / rightH;

      let drawW: number;
      let drawH: number;
      if (aspect < targetAspect) {
        drawW = rightW * zoom;
        drawH = (rightW / aspect) * zoom;
      } else {
        drawH = rightH * zoom;
        drawW = (rightH * aspect) * zoom;
      }

      const drawX = rightX + (rightW - drawW) / 2 + (config.rightImageOffsetX || 0) * scale;
      const drawY = rightY + (rightH - drawH) / 2 + (config.rightImageOffsetY || 0) * scale;

      ctx.drawImage(rightImg, drawX, drawY, drawW, drawH);
    } catch {
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(rightX, rightY, rightW, rightH);
    }
  }
  ctx.restore();

  // ==========================================
  // 4. Draw Split Screen Outer Red Borders & Center Divider
  // ==========================================
  ctx.save();
  ctx.strokeStyle = config.outerBorderColor || '#dc2626';
  ctx.lineWidth = redFrameBorderWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const borderR = userImgRadius > 0 ? userImgRadius : splitRadius;

  // Left frame border
  roundRect(ctx, leftX, leftY, leftW, leftH, borderR);
  ctx.stroke();

  // Right frame border
  roundRect(ctx, rightX, rightY, rightW, rightH, borderR);
  ctx.stroke();

  // Red glow on frame border
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
  ctx.lineWidth = redFrameBorderWidth + 4 * scale;
  if (userImgRadius > 0) {
    roundRect(ctx, leftX, leftY, leftW, leftH, borderR);
    ctx.stroke();
    roundRect(ctx, rightX, rightY, rightW, rightH, borderR);
    ctx.stroke();
  } else {
    roundRect(ctx, frameX, frameY, frameW, splitScreenH, splitRadius);
    ctx.stroke();
  }
  ctx.restore();

  // ==========================================
  // 5. Draw Center Watermark & Emblem
  // ==========================================
  if (config.showEmblem) {
    ctx.save();
    ctx.globalAlpha = config.emblemOpacity ?? 0.88;

    if (config.emblemBlendMode && config.emblemBlendMode !== 'normal') {
      ctx.globalCompositeOperation = config.emblemBlendMode;
    }

    // Load either processed transparent uploaded emblem, custom emblem, or vector generator SVG
    const emblemUrl =
      config.processedCustomEmblemSrc ||
      config.customEmblemSrc ||
      generateEmblemSvg(
        config.watermarkTitle || 'CYBER SENTINEL',
        config.watermarkSubtitle || 'BANGLADESH',
        config.watermarkTitleColor || '#7dd3fc',
        config.watermarkSubtitleColor || '#f87171'
      );

    try {
      const emblemImg = await loadImage(emblemUrl);
      const emblemBaseSize = 650 * scale;
      const emblemSize = emblemBaseSize * (config.emblemScale || 1);
      const emblemCenterX = size / 2;
      const emblemCenterY = (splitScreenH / 2 + frameY) + (config.emblemOffsetY || 0) * scale;
      const emblemDrawX = emblemCenterX - emblemSize / 2;
      const emblemDrawY = emblemCenterY - emblemSize / 2;
      const emblemRadius = emblemSize / 2;

      // Always clip to circle so square/white outer corners NEVER appear
      ctx.save();
      ctx.beginPath();
      ctx.arc(emblemCenterX, emblemCenterY, emblemRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(emblemImg, emblemDrawX, emblemDrawY, emblemSize, emblemSize);
      ctx.restore();
    } catch (err) {
      console.error('Failed to render emblem', err);
    }
    ctx.restore();
  }

  // ==========================================
  // 6. Draw Bottom White Banner with Red Outline
  // ==========================================
  ctx.save();
  const bannerW = frameW;
  const bannerX = frameX;
  const bannerRadius = (config.bannerCornerRadius || 24) * scale;
  const bannerBorderW = (config.bannerBorderWidth || 10) * scale;

  // Banner shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 18 * scale;
  ctx.shadowOffsetY = 6 * scale;

  // Banner Background Shell
  ctx.fillStyle = config.bannerBgColor || '#ffffff';
  roundRect(ctx, bannerX, bannerY, bannerW, bannerH, bannerRadius);
  ctx.fill();

  // Reset shadow for crisp border
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Banner Red Outline Border
  ctx.strokeStyle = config.bannerBorderColor || '#dc2626';
  ctx.lineWidth = bannerBorderW;
  roundRect(ctx, bannerX, bannerY, bannerW, bannerH, bannerRadius);
  ctx.stroke();

  // Outer red glow around banner
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
  ctx.lineWidth = bannerBorderW + 4 * scale;
  roundRect(ctx, bannerX, bannerY, bannerW, bannerH, bannerRadius);
  ctx.stroke();

  // ==========================================
  // 7. Render Banner Typography (Bangla & English)
  // ==========================================
  const centerX = bannerX + bannerW / 2;
  const baseFontSize = 32 * scale * (config.bannerFontSize || 1);
  const selectedFamily = config.bannerFontFamily || 'Hind Siliguri';
  const selectedWeight = config.bannerFontWeight || '800';
  const fontFam = `'${selectedFamily}', 'Noto Sans Bengali', system-ui, sans-serif`;

  // Freeform multi-line text is permanently active with inline per-word color support
  const textContent =
    config.freeformText ||
    `${config.bannerReasonText || 'প্রতিনিয়ত হ্যা,রেস,মেন্ট করার অ,প,রা,ধে'}\n${config.bannerActionText || 'একটি আইডি রি,মু,ভ করা হলো '} [color:#dc2626]${config.bannerTeamText || 'TEAM CSB'}[/color]\n${config.bannerFooterText || 'পক্ষ থেকে।'}`;

  const lines = textContent.split('\n').filter((l) => l.trim().length > 0);
  const lineH = baseFontSize * 1.36;
  const totalTextH = lines.length * lineH;
  let startY = bannerY + (bannerH - totalTextH) / 2 + lineH / 2;

  for (const line of lines) {
    const tokens = parseFormattedText(line, config.bannerTextColor || '#000000');
    drawFormattedTokens(ctx, tokens, centerX, startY, `${selectedWeight} ${baseFontSize}px ${fontFam}`);
    startY += lineH;
  }

  ctx.restore();
}
