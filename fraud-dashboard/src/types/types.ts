export interface FraudApp {
  app_name: string;
  developer: string;
  category: string;
  risk_level: string;
  reported_on: string;
}

export interface FraudURL {
  url: string;
  risk_level: string;
  detected_on: string;
  category: string;
}

export interface FraudTrend {
  date: string;
  fraud_cases_detected: number;
}

export interface FraudData {
  fraudulent_apps: FraudApp[];
  fraudulent_urls: FraudURL[];
  fraud_trends_30_days: FraudTrend[];
}
