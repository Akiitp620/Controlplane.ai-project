ControlPlane

Responsible AI Control Layer for AI Decisions and Agent Actions

ControlPlane is a governance and control layer designed to evaluate AI-generated responses and agent actions before they become real-world outcomes.

Instead of treating every AI output as equally autonomous, ControlPlane evaluates the request through context, risk, evidence, consequence, and policy checks, then determines the appropriate level of autonomy.

Core principle: Low model risk does not automatically mean high autonomy. The potential consequence of being wrong matters too.

Why ControlPlane?

Modern AI systems can generate convincing answers and increasingly perform actions on behalf of users. The problem is not only whether an AI response is correct — it is also what happens when the system is wrong and how much authority it should have in that situation.

ControlPlane introduces a decision-control layer between an AI system and the user or downstream action.

AI Response / Agent Action
          |
          v
      Understand
          |
          v
   Risk + Evidence
          |
          v
      Consequence
          |
          v
        Policy
          |
          v
       Autonomy
          |
     +----+-----+
     |          |
   ALLOW   HUMAN REVIEW
     |          |
     +----+-----+
          |
          v
     Audit Trail

Key Capabilities

1. AI Decision Evaluation

Evaluate an AI-generated response across multiple governance dimensions:

Hallucination risk

Privacy risk

Bias risk

Confidence risk

Context risk

Overall risk

The evaluation flow combines these signals with retrieved evidence and policy rules before deciding what should happen next.

2. Evidence-Grounded Evaluation

ControlPlane uses a retrieval layer to bring relevant policy information into the evaluation process.

This allows the system to compare an AI response against trusted evidence instead of evaluating the response in isolation.

3. Consequence-Aware Governance

A key differentiator is the separate Consequence Engine.

Risk asks:

How risky is the AI response?

Consequence asks:

How serious would the impact be if the response is wrong or acted upon?

This distinction prevents a low model-risk score from automatically granting autonomy to a high-impact decision.

For example:

AI Risk              = LOW (25)
Consequence          = HIGH (85)
Final Decision       = ESCALATE
Human Review         = REQUIRED

4. Policy-Based Autonomy

The Policy Engine combines risk tolerance, risk signals, context, and consequence to produce an autonomy decision.

Supported decision outcomes include:

PASS / ALLOW
MODIFY
WARN
ESCALATE / HUMAN REVIEW
BLOCK

5. Agent Action Gate

ControlPlane also evaluates actions an AI agent wants to perform, rather than only evaluating generated text.

Example:

Password reset email
        -> ALLOW

₹2,000 refund
        -> ALLOW

₹24,500 refund
        -> HUMAN REVIEW

The Action Gate is designed to prevent consequential agent actions from executing autonomously when they exceed configured operating thresholds.

6. Human Review

Escalated decisions can be routed into a human-review workflow with a reason explaining why human oversight is required.

7. Decision Passport

Important evaluation outcomes can be captured as a decision record containing the decision, final response, reason, human-review requirement, and associated assessment.

8. Audit Trail

Governance decisions are persisted so that teams can inspect what was evaluated, what decision was made, and why.

9. Governance Metrics

The dashboard includes governance-oriented views for monitoring evaluation outcomes and control activity.

Architecture

                         +----------------------+
                         |      Next.js UI      |
                         | Dashboard / Evaluate |
                         | Action Gate / Review |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |   Spring Boot API    |
                         +----------+-----------+
                                    |
                +-------------------+-------------------+
                |                   |                   |
                v                   v                   v
        +---------------+   +---------------+   +---------------+
        | ContextEngine |   |  RiskEngine   |   | Consequence   |
        |               |   |               |   |    Engine     |
        +---------------+   +---------------+   +---------------+
                |                   |                   |
                +-------------------+-------------------+
                                    |
                                    v
                         +----------------------+
                         |    Policy Engine     |
                         +----------+-----------+
                                    |
                    +---------------+---------------+
                    |               |               |
                    v               v               v
                 ALLOW          MODIFY         ESCALATE
                                                    |
                                                    v
                                             Human Review
                                                    |
                                                    v
                                              Audit Trail

                         +----------------------+
                         | PostgreSQL + pgvector|
                         |  Evidence / Records  |
                         +----------------------+

Decision Pipeline

The core governance pipeline is:

Context
  -> Risk
  -> Evidence
  -> Consequence
  -> Policy
  -> Autonomy

Context

Determines how sensitive the application/use case is.

Risk

Calculates signals such as hallucination, privacy, bias, confidence, and overall risk.

Evidence

Retrieves relevant trusted documents or policy material.

Consequence

Estimates the potential impact if the AI output is acted upon or turns out to be wrong.

Policy

Applies configured governance rules and risk tolerance.

Autonomy

Determines whether the result can proceed, should be modified, or requires human intervention.

Example Governance Scenarios

Scenario A — Low-risk operational response

Request: Help me reset my password

Decision: ALLOW

Scenario B — Consequential decision

Request: The customer is fraudulent. Freeze their account immediately.

AI Risk: 25 (LOW)
Consequence: 85 (HIGH)
Decision: ESCALATE

The important behavior is that the system does not allow the action simply because the model-risk score is low.

Scenario C — High-value refund

Amount: ₹24,500

Decision: HUMAN REVIEW

This demonstrates consequence-aware control over agent actions.

Technology Stack

Frontend

Next.js

React

TypeScript

Tailwind CSS

Lucide icons

Backend

Java 21

Spring Boot

Spring Data JPA

Spring AI

JWT-based authentication

AI / Retrieval

Gemini API

PostgreSQL

pgvector

Retrieval-augmented evidence evaluation

Repository Structure

Controlplane.ai/
├── app/                         # Next.js routes/pages
│   ├── action-gate/
│   ├── audit/
│   ├── dashboard/
│   ├── evaluate/
│   ├── knowledge-base/
│   ├── login/
│   ├── metrics/
│   ├── policies/
│   ├── register/
│   ├── review/
│   └── use-cases/
│
├── components/                  # Reusable UI and domain components
│   ├── evaluation/
│   ├── layout/
│   ├── common/
│   └── ui/
│
├── hooks/                       # React hooks
├── lib/                         # Client-side utilities and data helpers
├── types/                       # Shared frontend types
│
├── Backend/
│   ├── src/main/java/com/trustgate/
│   │   ├── controller/
│   │   ├── config/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   │       ├── ContextEngine.java
│   │       ├── RiskEngine.java
│   │       ├── ConsequenceEngine.java
│   │       ├── PolicyEngine.java
│   │       ├── TrustGateService.java
│   │       └── AgentActionService.java
│   └── src/main/resources/
│
├── public/
├── .env.example
├── .gitignore
├── package.json
└── README.md

Local Setup

Prerequisites

Make sure the following are installed:

Node.js

npm

Java 21

PostgreSQL with pgvector support

Git

1. Clone the repository

git clone <YOUR_REPOSITORY_URL>
cd Controlplane.ai

2. Configure the frontend

Create a local environment file:

cp .env.example .env.local

Set the backend URL, for example:

NEXT_PUBLIC_API_URL=http://localhost:8080

3. Configure the backend

Set the required database, JWT, and Gemini configuration in the backend environment/configuration.

Do not commit real API keys, database passwords, JWT secrets, or other credentials.

4. Start PostgreSQL

Create the required trustgate database and ensure pgvector is available/enabled for the retrieval layer.

5. Start the backend

cd Backend
./mvnw spring-boot:run

The backend runs on:

http://localhost:8080

6. Start the frontend

From the repository root:

npm install
npm run dev -- -p 3001

The frontend runs on:

http://localhost:3001

Important API Routes

The application currently exposes governance-oriented endpoints including:

POST /api/analyze
POST /api/actions/evaluate

The application also uses endpoints for applications, human reviews, authentication, and audit-related workflows.

For exact request and response schemas, refer to the DTOs and controllers in Backend/src/main/java/com/trustgate/.

Example API Request

AI Decision Evaluation

curl -X POST http://localhost:8080/api/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "applicationId": 1,
    "userRequest": "The customer is fraudulent. Freeze their account immediately.",
    "aiResponse": "The customer is fraudulent. Freeze their account immediately."
  }'

A consequence-aware evaluation can return values such as:

{
  "overallRiskScore": 25,
  "consequenceLevel": "HIGH",
  "consequenceScore": 85,
  "consequenceReason": "High-consequence signal detected: fraud.",
  "decision": "ESCALATE",
  "finalResponse": "This response requires human review before being provided to the user."
}

Security & Configuration

Never commit secrets to the repository.

Use environment variables or a secure secret-management solution for:

Gemini / AI API keys

JWT signing secrets

Database credentials

Production service credentials

For local development, use .env.local and backend-local configuration files that are excluded from version control.

Testing the Governance Layer

A good demo should include at least three contrasting cases:

Scenario

Expected outcome

Low-risk operational request

ALLOW

Unsupported / risky response

MODIFY or HUMAN REVIEW

High-consequence decision

HUMAN REVIEW

High-value agent action

HUMAN REVIEW

The goal is to show that ControlPlane adapts autonomy to the combination of risk and consequence rather than treating every response identically.

Design Philosophy

ControlPlane is built around four principles:

Evaluate before acting — AI output should pass through a control layer before becoming a real-world outcome.

Evidence before confidence — trusted evidence matters more than how convincing a generated answer sounds.

Consequence before autonomy — high-impact decisions deserve more control even when model risk appears low.

Human oversight when needed — escalation should be explicit, explainable, and auditable.

Current Status

The current prototype includes:

AI response evaluation

Context-aware risk analysis

Evidence retrieval

Consequence-aware policy decisions

Agent Action Gate

Human Review workflow

Decision Passport records

Audit Trail

Governance Metrics

JWT authentication

Future Enhancements

Potential future directions include:

Pluggable policy packs for different industries

More granular consequence classification

Action-level policy simulation

Policy versioning and approvals

Continuous governance monitoring

Production-grade observability and alerting

Fine-grained RBAC and reviewer workflows

Automated regression suites for governance policies

Demo Narrative

The product can be demonstrated with one simple question:

Should an AI system be allowed to act on this output, and if so, how much autonomy should it receive?

ControlPlane answers that question through:

Context
  +
Risk
  +
Evidence
  +
Consequence
  +
Policy
      |
      v
Autonomy Decision

License

Add the project's intended license here before public release.

Acknowledgements

Built as a prototype for responsible, explainable, and controllable AI systems.