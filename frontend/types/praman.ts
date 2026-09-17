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

// ─── Implementation Intelligence ────────────────────────────────────────────

export type TaskStatus = "Not Started" | "In Progress" | "Blocked" | "Completed" | "Delayed";
export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export type ImplementationTask = {
  id: string;
  name: string;
  description: string;
  owner: string;
  department: string;
  start_date: string;
  deadline: string;
  status: TaskStatus;
  priority: TaskPriority;
  completion_pct: number;
  depends_on: string[];
  risk: string;
  evidence: string;
  notes: string;
  data_class: DataClass;
};

export type BlockerInfo = {
  task_id: string;
  task_name: string;
  blocker_reason: string;
  responsible_owner: string;
  responsible_department: string;
  affected_task_ids: string[];
  recommended_action: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  data_class: DataClass;
};

export type ImplementationProject = {
  id: string;
  project_id: string;
  name: string;
  startup: string;
  department: string;
  tasks: ImplementationTask[];
  stage: string;
  data_class: DataClass;
};

// ─── Responsibility Matrix ───────────────────────────────────────────────────

export type ResponsibilityEntry = {
  id: string;
  activity: string;
  responsible_role: string;
  responsible_name: string;
  department: string;
  deadline: string;
  status: TaskStatus;
  blocked_by: string | null;
  notes: string;
  data_class: DataClass;
};

// ─── Post-Procurement Monitoring ────────────────────────────────────────────

export type KPIMeasurement = {
  name: string;
  promised: string;
  actual: string;
  unit: string;
  variance: string;
  met: boolean;
};

export type MonitoringRecord = {
  id: string;
  month: string;
  period: string;
  accuracy_pct: number;
  uptime_pct: number;
  cost_lakh: number;
  issues_count: number;
  kpis: KPIMeasurement[];
  notes: string;
  evidence_ref: string;
  data_class: DataClass;
};

// ─── Outcome Tracking ───────────────────────────────────────────────────────

export type OutcomeDimension = {
  name: string;
  expected: string;
  actual: string;
  variance: string;
  result: "Exceeded Target" | "Met Target" | "Partially Met" | "Below Target";
};

export type ProjectOutcome = {
  id: string;
  project_id: string;
  result: "Successful" | "Partially Successful" | "Failed";
  reason: string;
  related_evidence: string;
  related_dependency: string;
  dimensions: OutcomeDimension[];
  completion_date: string;
  actual_duration_days: number;
  data_class: DataClass;
};

// ─── Lessons Learned ────────────────────────────────────────────────────────

export type LessonCategory = "Technical" | "Integration" | "Operational" | "Governance" | "Commercial";

export type LessonLearned = {
  id: string;
  project_id: string;
  category: LessonCategory;
  lesson: string;
  what_worked: string;
  what_failed: string;
  delay_cause: string;
  dependency_issue: string;
  recommendation: string;
  reuse_recommended: boolean;
  startup_recommended: boolean;
  evidence_ref: string;
  outcome_ref: string;
  risk_ref: string;
  data_class: DataClass;
};

// ─── Institutional Memory ───────────────────────────────────────────────────

export type HistoricalOutcome = "Successful" | "Partially Successful" | "Failed";

export type InstitutionalMemoryRecord = {
  id: string;
  year: number;
  city: string;
  department: string;
  problem: string;
  domain: string;
  technology: string;
  startup: string;
  startup_id: string;
  outcome: HistoricalOutcome;
  actual_accuracy_pct: number;
  actual_cost_lakh: number;
  implementation_days: number;
  pilot_score: number;
  what_worked: string[];
  what_failed: string[];
  known_dependencies: string[];
  known_risks: string[];
  lessons: string[];
  failure_causes: string[];
  similarity_signature: string[];
  data_class: DataClass;
};

// ─── Reuse Intelligence ─────────────────────────────────────────────────────

export type ReuseRecommendation = {
  id: string;
  similarity_pct: number;
  previous_project_id: string;
  previous_city: string;
  previous_year: number;
  startup: string;
  startup_id: string;
  previous_pilot_score: number;
  production_outcome_pct: number;
  implementation_days: number;
  reuse_confidence_pct: number;
  recommendation: "REUSE EXISTING SOLUTION" | "ADAPT AND REUSE" | "NEW PROCUREMENT";
  reason: string;
  known_risks: string[];
  known_dependencies: string[];
  data_class: DataClass;
};

// ─── Risk Radar ─────────────────────────────────────────────────────────────

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RiskDimension = {
  category: string;
  score_pct: number;
  level: RiskLevel;
  reason: string;
  linked_task: string | null;
  linked_dependency: string | null;
  data_class: DataClass;
};

// ─── AI Decision Replay ─────────────────────────────────────────────────────

export type RankingCriterion = {
  name: string;
  weight_pct: number;
};

export type StartupRankRecord = {
  startup: string;
  score: number;
  rank: number;
};

export type DecisionReplay = {
  id: string;
  problem: string;
  problem_id: string;
  decision_date: string;
  model_version: string;
  dataset_version: string;
  evidence_records_used: number;
  criteria: RankingCriterion[];
  startup_scores: StartupRankRecord[];
  human_override: boolean;
  final_decision: string;
  officer: string;
  data_class: DataClass;
};

// ─── Model + Dataset Versioning ─────────────────────────────────────────────

export type ModelVersion = {
  id: string;
  model_name: string;
  version: string;
  dataset_name: string;
  dataset_version: string;
  ranking_policy: string;
  deployed_on: string;
  training_data_description: string;
  outcomes_included: number;
  data_class: DataClass;
};

// ─── Innovation Hub ─────────────────────────────────────────────────────────

export type HubChallengeStage = "DISCOVER" | "VALIDATE" | "DECIDE" | "SCALE";
export type HubUrgency = "Low" | "Medium" | "High" | "Critical";

export type HubChallenge = {
  id: string;
  display_id: string;
  title: string;
  department: string;
  location: string;
  domain: string;
  technology: string;
  status: string;
  stage: HubChallengeStage;
  urgency: HubUrgency;
  budget: string;
  submission_count: number;
  days_remaining: number;
  description: string;
  context: string;
  affected_area: string;
  current_process: string;
  current_limitations: string;
  expected_impact: string;
  functional_requirements: string[];
  technical_requirements: string[];
  kpis: Array<{ name: string; target: string }>;
  constraints: string[];
  deployment: string;
  integration: string;
  eligible_categories: string[];
  timeline: string;
  data_class: DataClass;
};

export type HubSolution = {
  id: string;
  challenge_id: string;
  challenge_title: string;
  challenge_display_id: string;
  solution_name: string;
  company: string;
  category: string;
  short_description: string;
  technical_capabilities: string;
  technology_stack: string;
  deployment_model: string;
  previous_deployments?: string;
  government_experience?: string;
  evidence_summary?: string;
  evidence_validation: string;
  evidence_confidence: string;
  implementation_timeline?: string;
  contact_email?: string;
  submitted_by: string;
  submitted_by_id: string;
  status: string;
  review_status: string;
  shortlisted: boolean;
  shortlist_reason?: string;
  shortlisted_by?: string;
  praman_case_id: string | null;
  moved_to_validation_by?: string;
  moved_to_validation_reason?: string;
  data_class: DataClass;
};

export type HubReviewQueueItem = {
  solution_id: string;
  solution_name: string;
  company: string;
  challenge_id: string;
  challenge_display_id: string;
  challenge_title: string;
  status: string;
  review_status: string;
  shortlisted: boolean;
  praman_case_id: string | null;
  submitted_by: string;
  evidence_confidence: string;
  data_class: DataClass;
};

