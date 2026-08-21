export interface Brand {
  name: string;
  x: number;
  y: number;
  isTarget: boolean;
}

export interface Reference {
  title: string;
  url: string;
  category: ReferenceCategory;
  relevanceNote: string;
}

export interface AxisDefinition {
  axisName: string;
  negativeLabel: string;
  positiveLabel: string;
  displayLabel: string;
  explanation: string;
}

export interface MarketOverviewQuantitativeSource {
  title: string;
  url: string;
  sourceType: 'Grand View Research';
  evidenceUsed: string;
  categoryLabel?: string;
}

export interface MarketOverviewQualitativeSource {
  title: string;
  url: string;
  sourceType: 'Deloitte' | 'PwC' | 'EY' | 'KPMG';
  evidenceUsed: string;
  categoryLabel?: string;
}

export interface MarketOverviewQuantitativeSizing {
  summary: string;
  marketSize?: string;
  cagr?: string;
  forecastPeriod?: string;
  keySegments?: string[];
  regionalNotes?: string[];
  sources: MarketOverviewQuantitativeSource[];
  sourceUnavailable?: boolean;
}

export interface MarketOverviewQualitativeTrends {
  summary: string;
  macroTrends: string[];
  consumerBehaviorInsights: string[];
  strategicImplications: string[];
  sources: MarketOverviewQualitativeSource[];
  sourceUnavailable?: boolean;
}

export interface MarketOverviewCompetitiveLandscape {
  summary: string;
  keyCompetitorGroups: string[];
  positioningPressure: string[];
  whitespaceOpportunities: string[];
}

export interface MarketOverview {
  marketCategory: string;
  quantitativeSizing: MarketOverviewQuantitativeSizing;
  qualitativeTrends: MarketOverviewQualitativeTrends;
  competitiveLandscape: MarketOverviewCompetitiveLandscape;
  limitations: string[];
}

export type ReferenceCategory =
  | 'official_brand'
  | 'government'
  | 'industry_databases'
  | 'news_media'
  | 'academic_research'
  | 'marketing_reports';

export type ScopeOption = 'Global' | 'Regional';

export interface MapData {
  scope: string;
  xAxisLabel: string;
  yAxisLabel: string;
  axisDefinitions: {
    x: AxisDefinition;
    y: AxisDefinition;
  };
  brands: Brand[];
  references: Reference[];
  positioningSummary: string;
  competitiveInterpretation: string;
  pointsOfParity?: string;
  pointsOfDifference?: string;
  marketOverview?: MarketOverview;
}

export interface BrandMapRequest {
  brandName: string;
  scope: string;
}
