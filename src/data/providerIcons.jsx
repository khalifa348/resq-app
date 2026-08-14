// ── Professional SVG icons for each service category ──
// All icons: 24x24 viewBox, 2px stroke, round caps/joins, minimal and clean

export const COLORS = {
  battery: '#84CC16',
  tire: '#60a5fa',
  towing: '#f87171',
  fuel: '#fbbf24',
  lockout: '#c084fc',
  engine: '#fb923c',
  overheating: '#f97316',
  default: '#84CC16',
};

export const ICON_SVGS = {
  battery: [
    '<rect x="5" y="5" width="14" height="10" rx="2" />',
    '<rect x="7" y="3" width="4" height="2" rx="1" fill="currentColor"/>',
    '<rect x="13" y="3" width="4" height="2" rx="1" fill="currentColor"/>',
    '<polyline points="11,8 9,12 11,12 10,16 14,12 12,12 14,8" fill="currentColor" stroke="none"/>',
  ].join(''),
  tire: [
    '<circle cx="12" cy="12" r="8" />',
    '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
    '<circle cx="12" cy="12" r="7" stroke-dasharray="3 4" />',
  ].join(''),
  towing: [
    '<path d="M4 10h10l2 3h2v3h-1a2.5 2.5 0 01-5 0H8a2.5 2.5 0 01-5 0H3v-6z" />',
    '<circle cx="6" cy="16" r="1.5" fill="currentColor" stroke="none"/>',
    '<circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none"/>',
    '<rect x="4" y="11" width="4" height="1.5" rx="0.75" fill="currentColor" stroke="none"/>',
  ].join(''),
  fuel: [
    '<path d="M16 6V4a2 2 0 00-2-2H6a2 2 0 00-2 2v16a2 2 0 002 2h8a2 2 0 002-2v-2" />',
    '<path d="M16 10h2.5a1.5 1.5 0 011.5 1.5V18" />',
    '<rect x="7" y="7" width="10" height="8" rx="1.5" fill="currentColor" stroke="none"/>',
  ].join(''),
  lockout: [
    '<circle cx="12" cy="14" r="3" fill="currentColor" stroke="none"/>',
    '<path d="M8 11V8a4 4 0 118 0v3" />',
    '<rect x="6" y="11" width="12" height="10" rx="2" />',
  ].join(''),
  engine: [
    '<circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>',
    '<path d="M12 3v3M12 18v3M3 12h3M18 12h3" />',
    '<path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12" />',
  ].join(''),
  overheating: [
    '<path d="M12 2v4M12 18v4" />',
    '<rect x="9" y="6" width="6" height="12" rx="3" />',
    '<line x1="10" y1="11" x2="14" y2="11" />',
    '<line x1="10" y1="14" x2="14" y2="14" />',
    '<circle cx="12" cy="21" r="1" fill="currentColor" stroke="none"/>',
  ].join(''),
  default: [
    '<circle cx="12" cy="12" r="8" />',
    '<path d="M12 8v4l2.5 2.5" />',
  ].join(''),
};

// Returns a full SVG string for use in innerHTML
export function getIconSvg(iconType) {
  const paths = ICON_SVGS[iconType] || ICON_SVGS.default;
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

// Returns SVG content for use with dangerouslySetInnerHTML (no outer svg tag)
export function getIconInnerHtml(iconType) {
  return ICON_SVGS[iconType] || ICON_SVGS.default;
}
