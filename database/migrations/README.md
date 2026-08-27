# PRAMAN Migrations

This prototype ships a SQL seed for judge reliability and documents the intended relational model.
Productionization would move these definitions into Alembic revisions while preserving UUID primary keys, JSONB fields, pgvector embeddings, append-only audit logs, and explicit `data_class` constraints.

Core intended tables:

`users`, `roles`, `user_roles`, `departments`, `startups`, `startup_capabilities`, `technologies`, `problems`, `requirements`, `requirement_versions`, `applications`, `eligibility_checks`, `evaluations`, `evaluation_criteria`, `pilots`, `pilot_kpis`, `kpi_results`, `evidence`, `documents`, `ai_recommendations`, `procurement_readiness_snapshots`, `procurement_handoffs`, `deployments`, `scale_plans`, `audit_logs`, `notifications`.
