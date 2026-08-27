export type DataClass = "OFFICIAL" | "PUBLIC" | "SIMULATED";

export type Problem = {
  id: string;
  display_id: string;
  department: string;
  location: string;
  title: string;
  narrative: string;
  budget: string;
  timeline_days: number;
  core_kpi: string;
  constraint: string;
  domain: string;
  technology: string;
  supporting: string[];
  deployment: string;
  security: string;
  status: string;
  data_class: DataClass;
};

export type Recommendation = {
  id: string;
  rank: number;
  startup: { id: string; name: string; dpiit: string; capabilities: string[]; data_class: DataClass };
  score: number;
  band: string;
  eligibility: { status: string; checks: Array<{ code: string; name: string; status: string; reason: string; data_class: DataClass }> };
  dimensions: Record<string, number>;
  pipeline: Record<string, unknown>;
  data_class: DataClass;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  reason: string;
  system_version: string;
  data_class: DataClass;
};
