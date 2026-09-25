/**
 * Unicode support for node-tikzjax.
 *
 * Provides automatic translation and placeholder handling for Unicode characters
 * (including CJK, Greek, mathematical symbols, Cyrillic, emojis, etc.) so that
 * the WebAssembly TeX engine and DVI-to-SVG conversion can render them properly
 * without TeX `Package inputenc Error` or font metric errors.
 */

export function isFullWidth(codePoint: number): boolean {
  return (
    (codePoint >= 0x4e00 && codePoint <= 0x9fff) || // CJK Unified Ideographs
    (codePoint >= 0x3400 && codePoint <= 0x4dbf) || // CJK Extension A
    (codePoint >= 0x20000 && codePoint <= 0x2a6df) || // CJK Extension B
    (codePoint >= 0x2a700 && codePoint <= 0x2b73f) || // CJK Extension C
    (codePoint >= 0x2b740 && codePoint <= 0x2b81f) || // CJK Extension D
    (codePoint >= 0x2b820 && codePoint <= 0x2ceaf) || // CJK Extension E
    (codePoint >= 0x2ceb0 && codePoint <= 0x2ebef) || // CJK Extension F
    (codePoint >= 0x30000 && codePoint <= 0x3134f) || // CJK Extension G
    (codePoint >= 0xf900 && codePoint <= 0xfaff) || // CJK Compatibility Ideographs
    (codePoint >= 0x2f800 && codePoint <= 0x2fa1f) || // CJK Compatibility Ideographs Supplement
    (codePoint >= 0x3040 && codePoint <= 0x309f) || // Hiragana
    (codePoint >= 0x30a0 && codePoint <= 0x30ff) || // Katakana
    (codePoint >= 0x31f0 && codePoint <= 0x31ff) || // Katakana Phonetic Extensions
    (codePoint >= 0xac00 && codePoint <= 0xd7af) || // Hangul Syllables
    (codePoint >= 0x1100 && codePoint <= 0x11ff) || // Hangul Jamo
    (codePoint >= 0x3130 && codePoint <= 0x318f) || // Hangul Compatibility Jamo
    (codePoint >= 0xa960 && codePoint <= 0xa97f) || // Hangul Jamo Extended-A
    (codePoint >= 0xd7b0 && codePoint <= 0xd7ff) || // Hangul Jamo Extended-B
    (codePoint >= 0x3000 && codePoint <= 0x303f) || // CJK Symbols and Punctuation
    (codePoint >= 0x3100 && codePoint <= 0x312f) || // Bopomofo
    (codePoint >= 0x31a0 && codePoint <= 0x31bf) || // Bopomofo Extended
    (codePoint >= 0x3190 && codePoint <= 0x319f) || // Kanbun
    (codePoint >= 0x3200 && codePoint <= 0x32ff) || // Enclosed CJK Letters and Months
    (codePoint >= 0x3300 && codePoint <= 0x33ff) || // CJK Compatibility
    (codePoint >= 0xa000 && codePoint <= 0xa4cf) || // Yi Syllables & Radicals
    (codePoint >= 0xff01 && codePoint <= 0xff60) || // Fullwidth ASCII Variants
    (codePoint >= 0xffe0 && codePoint <= 0xffe6) // Fullwidth Symbol Variants
  );
}

/**
 * Standard LaTeX math commands for common Unicode mathematical and Greek symbols.
 */
export const DEFAULT_UNICODE_MAP: Record<number, string> = {
  // Greek Lowercase
  0x03b1: '\\ensuremath{\\alpha}',
  0x03b2: '\\ensuremath{\\beta}',
  0x03b3: '\\ensuremath{\\gamma}',
  0x03b4: '\\ensuremath{\\delta}',
  0x03b5: '\\ensuremath{\\varepsilon}',
  0x03b6: '\\ensuremath{\\zeta}',
  0x03b7: '\\ensuremath{\\eta}',
  0x03b8: '\\ensuremath{\\theta}',
  0x03b9: '\\ensuremath{\\iota}',
  0x03ba: '\\ensuremath{\\kappa}',
  0x03bb: '\\ensuremath{\\lambda}',
  0x03bc: '\\ensuremath{\\mu}',
  0x03bd: '\\ensuremath{\\nu}',
  0x03be: '\\ensuremath{\\xi}',
  0x03c0: '\\ensuremath{\\pi}',
  0x03c1: '\\ensuremath{\\rho}',
  0x03c3: '\\ensuremath{\\sigma}',
  0x03c4: '\\ensuremath{\\tau}',
  0x03c5: '\\ensuremath{\\upsilon}',
  0x03c6: '\\ensuremath{\\phi}',
  0x03c7: '\\ensuremath{\\chi}',
  0x03c8: '\\ensuremath{\\psi}',
  0x03c9: '\\ensuremath{\\omega}',

  // Greek Uppercase
  0x0393: '\\ensuremath{\\Gamma}',
  0x0394: '\\ensuremath{\\Delta}',
  0x0398: '\\ensuremath{\\Theta}',
  0x039b: '\\ensuremath{\\Lambda}',
  0x039e: '\\ensuremath{\\Xi}',
  0x03a0: '\\ensuremath{\\Pi}',
  0x03a3: '\\ensuremath{\\Sigma}',
  0x03a5: '\\ensuremath{\\Upsilon}',
  0x03a6: '\\ensuremath{\\Phi}',
  0x03a8: '\\ensuremath{\\Psi}',
  0x03a9: '\\ensuremath{\\Omega}',

  // Mathematical Relations & Operators
  0x2264: '\\ensuremath{\\le}',
  0x2265: '\\ensuremath{\\ge}',
  0x2260: '\\ensuremath{\\ne}',
  0x2248: '\\ensuremath{\\approx}',
  0x2261: '\\ensuremath{\\equiv}',
  0x223c: '\\ensuremath{\\sim}',
  0x221d: '\\ensuremath{\\propto}',
  0x226a: '\\ensuremath{\\ll}',
  0x226b: '\\ensuremath{\\gg}',
  0x00b1: '\\ensuremath{\\pm}',
  0x2213: '\\ensuremath{\\mp}',
  0x00d7: '\\ensuremath{\\times}',
  0x00f7: '\\ensuremath{\\div}',
  0x2217: '\\ensuremath{\\ast}',
  0x22c5: '\\ensuremath{\\cdot}',
  0x00b7: '\\ensuremath{\\cdot}',
  0x2218: '\\ensuremath{\\circ}',
  0x00b0: '\\ensuremath{^\\circ}', // Degree symbol

  // Superscripts & Fractions
  0x00b2: '\\ensuremath{^2}',
  0x00b3: '\\ensuremath{^3}',
  0x00b9: '\\ensuremath{^1}',
  0x2070: '\\ensuremath{^0}',
  0x207b: '\\ensuremath{^-}',
  0x00bd: '\\ensuremath{\\frac{1}{2}}',
  0x00bc: '\\ensuremath{\\frac{1}{4}}',
  0x00be: '\\ensuremath{\\frac{3}{4}}',
  0x00b5: '\\ensuremath{\\mu}', // Micro sign

  // Arrows
  0x2192: '\\ensuremath{\\rightarrow}',
  0x2190: '\\ensuremath{\\leftarrow}',
  0x2191: '\\ensuremath{\\uparrow}',
  0x2193: '\\ensuremath{\\downarrow}',
  0x2194: '\\ensuremath{\\leftrightarrow}',
  0x21d2: '\\ensuremath{\\Rightarrow}',
  0x21d0: '\\ensuremath{\\Leftarrow}',
  0x21d4: '\\ensuremath{\\Leftrightarrow}',
  0x21a6: '\\ensuremath{\\mapsto}',

  // Sets & Logic
  0x2208: '\\ensuremath{\\in}',
  0x2209: '\\ensuremath{\\notin}',
  0x2282: '\\ensuremath{\\subset}',
  0x2286: '\\ensuremath{\\subseteq}',
  0x2283: '\\ensuremath{\\supset}',
  0x2287: '\\ensuremath{\\supseteq}',
  0x222a: '\\ensuremath{\\cup}',
  0x2229: '\\ensuremath{\\cap}',
  0x2205: '\\ensuremath{\\emptyset}',
  0x221e: '\\ensuremath{\\infty}',
  0x2200: '\\ensuremath{\\forall}',
  0x2203: '\\ensuremath{\\exists}',
  0x2204: '\\ensuremath{\\nexists}',
  0x00ac: '\\ensuremath{\\neg}',
  0x2227: '\\ensuremath{\\land}',
  0x2228: '\\ensuremath{\\lor}',

  // Calculus & Algebra
  0x2211: '\\ensuremath{\\sum}',
  0x220f: '\\ensuremath{\\prod}',
  0x222b: '\\ensuremath{\\int}',
  0x222e: '\\ensuremath{\\oint}',
  0x221a: '\\ensuremath{\\surd}',
  0x2202: '\\ensuremath{\\partial}',
  0x2207: '\\ensuremath{\\nabla}',

  // Ellipsis & Dots
  0x2026: '\\ensuremath{\\dots}',
  0x22ef: '\\ensuremath{\\cdots}',
  0x22f1: '\\ensuremath{\\ddots}',
  0x22ee: '\\ensuremath{\\vdots}',

  // Delimiters & Shapes
  0x27e8: '\\ensuremath{\\langle}',
  0x27e9: '\\ensuremath{\\rangle}',
  0x2223: '\\ensuremath{\\mid}',
  0x2225: '\\ensuremath{\\parallel}',
  0x22a5: '\\ensuremath{\\bot}',
  0x22a4: '\\ensuremath{\\top}',
  0x2220: '\\ensuremath{\\angle}',
  0x2295: '\\ensuremath{\\oplus}',
  0x2296: '\\ensuremath{\\ominus}',
  0x2297: '\\ensuremath{\\otimes}',
  0x2298: '\\ensuremath{\\oslash}',
  0x2299: '\\ensuremath{\\odot}',
};

/**
 * Characters that are already natively supported by LaTeX's utf8.def without missing font errors.
 */
const NATIVELY_SUPPORTED = new Set([
  // Latin-1 accented letters supported in OT1 without tcrm1000
  0x00c0, 0x00c1, 0x00c2, 0x00c3, 0x00c4, 0x00c5, 0x00c6, 0x00c7, 0x00c8, 0x00c9,
  0x00ca, 0x00cb, 0x00cc, 0x00cd, 0x00ce, 0x00cf, 0x00d1, 0x00d2, 0x00d3, 0x00d4,
  0x00d5, 0x00d6, 0x00d8, 0x00d9, 0x00da, 0x00db, 0x00dc, 0x00dd, 0x00df, 0x00e0,
  0x00e1, 0x00e2, 0x00e3, 0x00e4, 0x00e5, 0x00e6, 0x00e7, 0x00e8, 0x00e9, 0x00ea,
  0x00eb, 0x00ec, 0x00ed, 0x00ee, 0x00ef, 0x00f1, 0x00f2, 0x00f3, 0x00f4, 0x00f5,
  0x00f6, 0x00f8, 0x00f9, 0x00fa, 0x00fb, 0x00fc, 0x00fd, 0x00ff,
  // Punctuation
  0x00a1, // ¡
  0x00bf, // ¿
  0x2014, // — em dash
  0x2013, // – en dash
  0x201c, // “ left double quote
  0x201d, // ” right double quote
  0x2018, // ‘ left single quote
  0x2019, // ’ right single quote
]);

/**
 * Scan input for Unicode characters and generate preamble definitions using `\DeclareUnicodeCharacter`.
 */
export function generateUnicodePreamble(
  text: string,
  customMap?: Record<string, string>
): string {
  // Check for any DeclareUnicodeCharacter already declared in the input
  const alreadyDeclared = new Set<string>();
  const declareRegex = /\\DeclareUnicodeCharacter\{([0-9A-Fa-f]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = declareRegex.exec(text)) !== null) {
    if (match[1]) {
      alreadyDeclared.add(match[1].toUpperCase());
    }
  }

  // Scan all unique characters
  const uniqueCodePoints = new Set<number>();
  for (const char of text) {
    const cp = char.codePointAt(0);
    if (cp !== undefined && cp > 127 && !NATIVELY_SUPPORTED.has(cp)) {
      uniqueCodePoints.add(cp);
    }
  }

  let preamble = '';

  for (const cp of uniqueCodePoints) {
    const hex = cp.toString(16).toUpperCase().padStart(4, '0');
    if (alreadyDeclared.has(hex)) {
      continue;
    }

    const charStr = String.fromCodePoint(cp);

    // 1. Check user-provided custom map
    if (customMap && (customMap[charStr] || customMap[hex])) {
      const target = customMap[charStr] || customMap[hex];
      preamble += `\\DeclareUnicodeCharacter{${hex}}{${target}}\n`;
      continue;
    }

    // 2. Check default symbol map (LaTeX math / Greek symbols)
    if (DEFAULT_UNICODE_MAP[cp]) {
      preamble += `\\DeclareUnicodeCharacter{${hex}}{${DEFAULT_UNICODE_MAP[cp]}}\n`;
      continue;
    }

    // 3. General Unicode characters (CJK, Cyrillic, Emojis, etc.)
    // Uses cmtt font to avoid kerning splits between placeholder characters
    const width = isFullWidth(cp) ? '1em' : '0.5em';
    const placeholder = `TKZUNI${hex}`;
    preamble += `\\DeclareUnicodeCharacter{${hex}}{\\makebox[${width}][l]{\\fontfamily{cmtt}\\selectfont ${placeholder}}}\n`;
  }

  return preamble;
}

/**
 * Restore Unicode characters in the generated SVG from placeholders.
 */
export function restoreUnicodeInSvg(svg: string): string {
  if (!svg.includes('TKZUNI')) {
    return svg;
  }

  // Replace placeholder tokens with their original characters
  svg = svg.replace(/TKZUNI([0-9A-Fa-f]{4,6})/g, (_match, hex) => {
    const cp = parseInt(hex, 16);
    const char = String.fromCodePoint(cp);
    if (char === '&') return '&amp;';
    if (char === '<') return '&lt;';
    if (char === '>') return '&gt;';
    if (char === '"') return '&quot;';
    return char;
  });

  // Add system font fallback to cmtt10 elements containing restored Unicode characters
  svg = svg.replace(
    /font-family="cmtt10"/g,
    'font-family="cmtt10, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'PingFang SC\', \'Microsoft YaHei\', sans-serif"'
  );

  return svg;
}
