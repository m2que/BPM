import { GoogleGenAI } from '@google/genai';
import type { MarketOverview } from '../types';

type VercelRequest = {
  method?: string;
  body?: {
    brandName?: unknown;
  };
};

type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

const buildMarketOverviewPrompt = (brandName: string) => `
Return a single raw JSON object for the broader market/category of "${brandName}" using this exact shape:
{
  "marketCategory": string,
  "quantitativeSizing": {
    "summary": string,
    "marketSize": string,
    "cagr": string,
    "forecastPeriod": string,
    "keySegments": string[],
    "regionalNotes": string[],
    "sources": [
      {
        "title": string,
        "url": string,
        "sourceType": "Grand View Research",
        "evidenceUsed": string
      }
    ]
  },
  "qualitativeTrends": {
    "summary": string,
    "macroTrends": string[],
    "consumerBehaviorInsights": string[],
    "strategicImplications": string[],
    "sources": [
      {
        "title": string,
        "url": string,
        "sourceType": "Deloitte" | "PwC" | "EY" | "KPMG",
        "evidenceUsed": string
      }
    ]
  },
  "competitiveLandscape": {
    "summary": string,
    "keyCompetitorGroups": string[],
    "positioningPressure": string[],
    "whitespaceOpportunities": string[]
  },
  "limitations": string[]
}

Rules:
- First identify the broader market/category, not just the brand.
- Search specifically for Grand View Research market reports before concluding sizing is unavailable.
- Search specifically for Deloitte, PwC, EY, and KPMG category/consumer trend reports before concluding qualitative evidence is unavailable.
- Use only Grand View Research for quantitative market sizing, CAGR, forecast period, segment growth, regional growth, and category sizing.
- Use only Deloitte, PwC, EY, and KPMG for qualitative macroeconomic and consumer behavior insights.
- Do not invent URLs, report titles, market sizes, CAGR values, or forecasts.
- Copy URLs exactly from grounded search results.
- If no valid Grand View Research source is found, say quantitative market sizing is unavailable from the required source set.
- If no valid Big 4 source is found, say qualitative trend evidence is unavailable from the required source set.
- Keep the overview concise, professional, and decision-useful.
- Tie implications back to awareness, associations, perceived quality, loyalty, or differentiation where useful.
- Do not use any other source families.
- Do not repeat the same source URL in multiple source arrays.
- If a valid source exists, include it in the sources array instead of describing it only in summary text.
- keySegments must contain only short segment names, not sentences, CAGR statements, or forecast text.
- Put growth explanations, segment share notes, and forecast commentary in summary or regionalNotes, not in keySegments.
- competitiveLandscape must be interpretive and concise.
- competitiveLandscape should explain category crowding, competitor grouping, and whitespace opportunities relevant to brand positioning.
`;

const emptyMarketOverview = (): MarketOverview => ({
  marketCategory: 'Unavailable',
  quantitativeSizing: {
    summary: 'Quantitative market sizing is unavailable from the required source set.',
    sources: []
  },
  qualitativeTrends: {
    summary: 'Qualitative trend evidence is unavailable from the required source set.',
    macroTrends: [],
    consumerBehaviorInsights: [],
    strategicImplications: [],
    sources: []
  },
  competitiveLandscape: {
    summary: 'Competitive landscape interpretation is limited without complete category context.',
    keyCompetitorGroups: [],
    positioningPressure: [],
    whitespaceOpportunities: []
  },
  limitations: [
    'Quantitative market sizing is unavailable from the required source set.',
    'Qualitative trend evidence is unavailable from the required source set.'
  ]
});

const parseMarketOverviewResponse = (jsonText: string, verifiedSources: Map<string, string>): MarketOverview => {
  let cleanedJsonText = jsonText.trim();

  if (cleanedJsonText.startsWith('```json')) {
    cleanedJsonText = cleanedJsonText.substring(7, cleanedJsonText.length - 3).trim();
  } else if (cleanedJsonText.startsWith('```')) {
    cleanedJsonText = cleanedJsonText.substring(3, cleanedJsonText.length - 3).trim();
  }

  const parsed = JSON.parse(cleanedJsonText) as Partial<MarketOverview> & Record<string, any>;
  const fallback = emptyMarketOverview();

  const groundedEntries = Array.from(verifiedSources.entries()).map(([url, title]) => ({ url, title }));

  const cleanSourceTitle = (title: string, url: string, sourceLabel: string): string => {
    const trimmed = title.trim();
    if (!trimmed) return `${sourceLabel} report`;
    if (/^(www\.)?[a-z0-9-]+\.[a-z]{2,}/i.test(trimmed)) return `${sourceLabel} report`;
    if (/^(pwc|ey|kpmg|deloitte|grand view research)\.com$/i.test(trimmed)) return `${sourceLabel} report`;
    if (trimmed.toLowerCase() === url.trim().toLowerCase()) return `${sourceLabel} report`;
    return trimmed;
  };

  const dedupeByUrl = <T extends { url: string }>(sources: T[]): T[] => {
    const seen = new Set<string>();
    return sources.filter((source) => {
      const key = source.url.replace(/\/$/, '').toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const cleanStringArray = (value: unknown, limit = 6) => Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, limit)
    : [];

  const cleanSegmentNames = (segments: unknown): string[] => {
    return cleanStringArray(segments)
      .filter((segment) => !/[.:]/.test(segment))
      .filter((segment) => !/\b(cagr|revenue share|market share|expected to grow|anticipated to grow|projected|forecast|through \d{4}|from \d{4}|to \d{4})\b/i.test(segment));
  };

  const fallbackQuantitativeSources = groundedEntries
    .filter(({ url, title }) => /grand view research/i.test(`${title} ${url}`))
    .slice(0, 2)
    .map(({ url, title }) => ({
      title: cleanSourceTitle(title || '', url, 'Grand View Research'),
      url,
      sourceType: 'Grand View Research' as const,
      evidenceUsed: 'Allowed quantitative market source.',
      categoryLabel: 'Grand View Research'
    }));

  const fallbackQualitativeSources = groundedEntries
    .filter(({ url, title }) => ['deloitte', 'pwc', 'ey', 'kpmg'].some((token) => `${title} ${url}`.toLowerCase().includes(token)))
    .slice(0, 4)
    .map(({ url, title }) => {
      const combined = `${title} ${url}`.toLowerCase();
      const sourceType = combined.includes('deloitte') ? 'Deloitte' : combined.includes('kpmg') ? 'KPMG' : combined.includes('pwc') ? 'PwC' : 'EY';
      return {
        title: cleanSourceTitle(title || '', url, sourceType),
        url,
        sourceType: sourceType as 'Deloitte' | 'PwC' | 'EY' | 'KPMG',
        evidenceUsed: 'Allowed qualitative trend source.',
        categoryLabel: sourceType
      };
    });

  const quantitativeSources = Array.isArray(parsed.quantitativeSizing?.sources)
    ? parsed.quantitativeSizing.sources.filter((source: { title?: string; url?: string; sourceType?: string; evidenceUsed?: string }) => {
        const url = (source.url || '').trim();
        const title = verifiedSources.get(url) || source.title || '';
        return Boolean(url) && verifiedSources.has(url) && source.sourceType === 'Grand View Research' && /grand view research/i.test(`${title} ${url}`);
      }).map((source: { title: string; url: string; evidenceUsed?: string }) => ({
        title: cleanSourceTitle(verifiedSources.get(source.url) || source.title || '', source.url, 'Grand View Research'),
        url: source.url,
        sourceType: 'Grand View Research' as const,
        evidenceUsed: source.evidenceUsed?.trim() || 'Market sizing context.',
        categoryLabel: 'Grand View Research'
      }))
    : [];

  const qualitativeSources = Array.isArray(parsed.qualitativeTrends?.sources)
    ? parsed.qualitativeTrends.sources.filter((source: { title?: string; url?: string; evidenceUsed?: string }) => {
        const url = (source.url || '').trim();
        const title = verifiedSources.get(url) || source.title || '';
        const combined = `${title} ${url}`.toLowerCase();
        return Boolean(url) && verifiedSources.has(url) && ['deloitte', 'pwc', 'ey', 'kpmg'].some((token) => combined.includes(token));
      }).map((source: { title: string; url: string; evidenceUsed?: string }) => {
        const rawTitle = verifiedSources.get(source.url) || source.title || '';
        const combined = `${rawTitle} ${source.url}`.toLowerCase();
        const sourceType = combined.includes('deloitte') ? 'Deloitte' : combined.includes('kpmg') ? 'KPMG' : combined.includes('pwc') ? 'PwC' : 'EY';
        return {
          title: cleanSourceTitle(rawTitle, source.url, sourceType),
          url: source.url,
          sourceType: sourceType as 'Deloitte' | 'PwC' | 'EY' | 'KPMG',
          evidenceUsed: source.evidenceUsed?.trim() || 'Consumer and market context.',
          categoryLabel: sourceType
        };
      })
    : [];

  const dedupedQuantitativeSources = dedupeByUrl(quantitativeSources.length > 0 ? quantitativeSources : fallbackQuantitativeSources);
  const dedupedQualitativeSources = dedupeByUrl(
    (qualitativeSources.length > 0 ? qualitativeSources : fallbackQualitativeSources)
      .filter((source) => !dedupedQuantitativeSources.some((quantSource) => quantSource.url.replace(/\/$/, '').toLowerCase() === source.url.replace(/\/$/, '').toLowerCase()))
  );

  const limitations = cleanStringArray(parsed.limitations, 8);
  const quantitativeUnavailable = dedupedQuantitativeSources.length === 0;
  const qualitativeUnavailable = dedupedQualitativeSources.length === 0;

  if (quantitativeUnavailable && !limitations.includes(fallback.limitations[0])) {
    limitations.push(fallback.limitations[0]);
  }
  if (qualitativeUnavailable && !limitations.includes(fallback.limitations[1])) {
    limitations.push(fallback.limitations[1]);
  }

  return {
    marketCategory: typeof parsed.marketCategory === 'string' && parsed.marketCategory.trim() ? parsed.marketCategory.trim() : fallback.marketCategory,
    quantitativeSizing: {
      summary: typeof parsed.quantitativeSizing?.summary === 'string' && parsed.quantitativeSizing.summary.trim() ? parsed.quantitativeSizing.summary.trim() : fallback.quantitativeSizing.summary,
      marketSize: typeof parsed.quantitativeSizing?.marketSize === 'string' ? parsed.quantitativeSizing.marketSize.trim() : undefined,
      cagr: typeof parsed.quantitativeSizing?.cagr === 'string' ? parsed.quantitativeSizing.cagr.trim() : undefined,
      forecastPeriod: typeof parsed.quantitativeSizing?.forecastPeriod === 'string' ? parsed.quantitativeSizing.forecastPeriod.trim() : undefined,
      keySegments: cleanSegmentNames(parsed.quantitativeSizing?.keySegments),
      regionalNotes: cleanStringArray(parsed.quantitativeSizing?.regionalNotes),
      sources: dedupedQuantitativeSources,
      sourceUnavailable: quantitativeUnavailable
    },
    qualitativeTrends: {
      summary: typeof parsed.qualitativeTrends?.summary === 'string' && parsed.qualitativeTrends.summary.trim() ? parsed.qualitativeTrends.summary.trim() : fallback.qualitativeTrends.summary,
      macroTrends: cleanStringArray(parsed.qualitativeTrends?.macroTrends),
      consumerBehaviorInsights: cleanStringArray(parsed.qualitativeTrends?.consumerBehaviorInsights),
      strategicImplications: cleanStringArray(parsed.qualitativeTrends?.strategicImplications),
      sources: dedupedQualitativeSources,
      sourceUnavailable: qualitativeUnavailable
    },
    competitiveLandscape: {
      summary: typeof parsed.competitiveLandscape?.summary === 'string' && parsed.competitiveLandscape.summary.trim() ? parsed.competitiveLandscape.summary.trim() : fallback.competitiveLandscape.summary,
      keyCompetitorGroups: cleanStringArray(parsed.competitiveLandscape?.keyCompetitorGroups),
      positioningPressure: cleanStringArray(parsed.competitiveLandscape?.positioningPressure),
      whitespaceOpportunities: cleanStringArray(parsed.competitiveLandscape?.whitespaceOpportunities)
    },
    limitations
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brandName } = req.body ?? {};
  const normalizedBrandName = typeof brandName === 'string' ? brandName.trim() : '';

  if (!normalizedBrandName) {
    return res.status(400).json({ error: 'Brand name is required' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildMarketOverviewPrompt(normalizedBrandName),
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1
      }
    });

    const verifiedSources = new Map<string, string>();
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    groundingChunks.forEach((chunk) => {
      if (chunk.web?.uri) {
        verifiedSources.set(chunk.web.uri, chunk.web.title || '');
      }
    });

    const data = parseMarketOverviewResponse(response.text, verifiedSources);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Market overview generation failed:', error);
    return res.status(500).json(emptyMarketOverview());
  }
}
