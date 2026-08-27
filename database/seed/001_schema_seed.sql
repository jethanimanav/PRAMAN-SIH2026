CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  actor text NOT NULL,
  role text NOT NULL,
  action text NOT NULL,
  entity text NOT NULL,
  reason text NOT NULL,
  system_version text NOT NULL,
  data_class text NOT NULL CHECK (data_class IN ('OFFICIAL', 'PUBLIC', 'SIMULATED'))
);

CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  data_class text NOT NULL CHECK (data_class = 'SIMULATED')
);

CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  embedding vector(8),
  data_class text NOT NULL CHECK (data_class = 'SIMULATED')
);

CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id text NOT NULL,
  title text NOT NULL,
  narrative text NOT NULL,
  department_id uuid REFERENCES departments(id),
  data_class text NOT NULL CHECK (data_class = 'SIMULATED')
);

CREATE TABLE IF NOT EXISTS requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES problems(id),
  status text NOT NULL,
  requirement_object jsonb NOT NULL,
  data_class text NOT NULL CHECK (data_class = 'SIMULATED')
);

CREATE TABLE IF NOT EXISTS pilots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id uuid REFERENCES problems(id),
  startup_id uuid REFERENCES startups(id),
  status text NOT NULL,
  score jsonb,
  data_class text NOT NULL CHECK (data_class = 'SIMULATED')
);

CREATE TABLE IF NOT EXISTS procurement_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id uuid REFERENCES pilots(id),
  handoff jsonb NOT NULL,
  human_decision_id uuid,
  data_class text NOT NULL CHECK (data_class = 'SIMULATED')
);

INSERT INTO departments (name, location, data_class)
VALUES
  ('Urban Development / PWD', 'Pune', 'SIMULATED'),
  ('Mumbai Urban Development', 'Mumbai', 'SIMULATED'),
  ('Nashik Municipal', 'Nashik', 'SIMULATED'),
  ('Nagpur PWD', 'Nagpur', 'SIMULATED')
ON CONFLICT DO NOTHING;

INSERT INTO startups (name, capabilities, embedding, data_class)
VALUES
  ('SkylineAI Solutions', '["Computer Vision","GPS","Edge deployment","Geospatial outputs","ITS pilot evidence"]', '[0.9,0.8,0.8,0.7,0.7,0.6,0.6,0.5]', 'SIMULATED'),
  ('AeroScan Tech', '["Drone analytics","Geospatial capability"]', '[0.7,0.6,0.4,0.6,0.4,0.4,0.5,0.3]', 'SIMULATED'),
  ('UrbanSentry', '["Road monitoring","Municipal workflow"]', '[0.6,0.5,0.4,0.5,0.5,0.3,0.4,0.3]', 'SIMULATED')
ON CONFLICT DO NOTHING;
