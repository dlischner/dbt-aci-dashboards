# DBT AC-I Dashboards

Interactive mock-ups of dashboards built on top of AI-generated DBT adherence ratings. Live demo: https://dbt-aci-dashboards.vercel.app

## Background

The DBT Adherence Checklist for Individual Therapy (DBT AC-I; Harned, Schmidt, & Korslund, 2021) is a validated instrument for rating how faithfully a therapist delivers Dialectical Behavior Therapy in a session. Historically it has required trained human raters, which makes it too slow and expensive to use at scale.

At Therassist.AI we rate session transcripts against the DBT AC-I with an LLM pipeline (26 strategy-specific prompts, Azure OpenAI, Langfuse for eval tracking), currently at 91%+ agreement with trained human raters. These mock-ups explore what becomes possible once every session has an adherence score.

## What's here

Four role-based views, each with illustrative data:

Clinician: personal adherence trends, category strengths, improvement opportunities, and change/acceptance balance.

Supervisor: supervisee comparisons, drill-down to sessions, a flagged-sessions queue, and aggregate team metrics.

Management: contract compliance, program breakdowns, trainee time-to-adherence, certification pipeline, and risk flags.

Payer: contract monitoring, adherence and rating coverage, network benchmarking, quality indicators, and renewal recommendations.

## Running locally

npm install, then npm run dev (Vite).

## Status

Prototype only. All data is synthetic. The production rating pipeline lives in a private repo.
