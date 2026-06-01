type CoverTheme = {
  start: string;
  end: string;
  accent: string;
  text: string;
  mark: "tiles" | "route" | "moon" | "waves" | "cards";
};

const themes: Record<string, CoverTheme> = {
  galaxy: {
    start: "#16324f",
    end: "#5b2a86",
    accent: "#f6bd60",
    text: "GALAXY",
    mark: "moon"
  },
  castle: {
    start: "#37505c",
    end: "#7a4f35",
    accent: "#e9c46a",
    text: "CASTLE",
    mark: "tiles"
  },
  cafe: {
    start: "#b65f35",
    end: "#2d6a4f",
    accent: "#fff3b0",
    text: "CAFE",
    mark: "cards"
  },
  ocean: {
    start: "#116466",
    end: "#1f4e79",
    accent: "#ffd166",
    text: "OCEAN",
    mark: "waves"
  },
  library: {
    start: "#4b3f72",
    end: "#2f5d62",
    accent: "#e07a5f",
    text: "LIBRARY",
    mark: "cards"
  },
  rail: {
    start: "#264653",
    end: "#8a5a44",
    accent: "#f4a261",
    text: "RAIL",
    mark: "route"
  },
  forest: {
    start: "#2d6a4f",
    end: "#588157",
    accent: "#f2cc8f",
    text: "FOREST",
    mark: "tiles"
  },
  market: {
    start: "#6d597a",
    end: "#b56576",
    accent: "#f6bd60",
    text: "MARKET",
    mark: "cards"
  },
  cyber: {
    start: "#0f4c5c",
    end: "#9a031e",
    accent: "#fb8b24",
    text: "CYBER",
    mark: "route"
  },
  island: {
    start: "#287271",
    end: "#e76f51",
    accent: "#ffe66d",
    text: "ISLAND",
    mark: "waves"
  }
};

const markSvg = (theme: CoverTheme) => {
  if (theme.mark === "moon") {
    return `
      <circle cx="202" cy="76" r="36" fill="${theme.accent}" opacity=".95"/>
      <circle cx="190" cy="66" r="5" fill="#ffffff" opacity=".5"/>
      <circle cx="215" cy="86" r="8" fill="#ffffff" opacity=".32"/>
      <path d="M28 174 C78 126 130 224 188 172 S270 156 314 208" fill="none" stroke="#fff" stroke-width="10" opacity=".25"/>
    `;
  }

  if (theme.mark === "route") {
    return `
      <path d="M32 185 C92 115 136 218 196 150 S276 100 312 172" fill="none" stroke="${theme.accent}" stroke-width="11" stroke-linecap="round"/>
      <circle cx="80" cy="147" r="13" fill="#ffffff" opacity=".9"/>
      <circle cx="196" cy="150" r="13" fill="#ffffff" opacity=".9"/>
      <circle cx="285" cy="128" r="13" fill="#ffffff" opacity=".9"/>
    `;
  }

  if (theme.mark === "waves") {
    return `
      <path d="M0 166 C42 142 76 142 118 166 S194 190 236 166 S312 142 352 166 V248 H0 Z" fill="${theme.accent}" opacity=".55"/>
      <path d="M0 194 C48 166 80 166 128 194 S208 222 256 194 S320 166 352 194 V248 H0 Z" fill="#ffffff" opacity=".22"/>
    `;
  }

  if (theme.mark === "cards") {
    return `
      <rect x="68" y="82" width="86" height="122" rx="12" fill="#ffffff" opacity=".85" transform="rotate(-10 111 143)"/>
      <rect x="154" y="72" width="86" height="122" rx="12" fill="${theme.accent}" opacity=".95" transform="rotate(8 197 133)"/>
      <circle cx="198" cy="132" r="24" fill="#ffffff" opacity=".33"/>
    `;
  }

  return `
    <rect x="44" y="88" width="70" height="70" rx="10" fill="${theme.accent}" opacity=".9"/>
    <rect x="132" y="88" width="70" height="70" rx="10" fill="#ffffff" opacity=".7"/>
    <rect x="220" y="88" width="70" height="70" rx="10" fill="${theme.accent}" opacity=".72"/>
    <rect x="88" y="170" width="70" height="52" rx="10" fill="#ffffff" opacity=".48"/>
    <rect x="176" y="170" width="70" height="52" rx="10" fill="${theme.accent}" opacity=".62"/>
  `;
};

const buildCover = (theme: CoverTheme) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 248" role="img">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${theme.start}"/>
          <stop offset="1" stop-color="${theme.end}"/>
        </linearGradient>
      </defs>
      <rect width="352" height="248" rx="18" fill="url(#bg)"/>
      <rect x="18" y="18" width="316" height="212" rx="16" fill="none" stroke="#fff" stroke-width="2" opacity=".28"/>
      ${markSvg(theme)}
      <text x="28" y="52" font-family="Arial, sans-serif" font-size="24" font-weight="800" fill="#fff" letter-spacing="2">${theme.text}</text>
      <text x="28" y="222" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#fff" opacity=".86">BOARD GAME</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const coverImages = Object.fromEntries(
  Object.entries(themes).map(([key, theme]) => [key, buildCover(theme)])
) as Record<keyof typeof themes, string>;
