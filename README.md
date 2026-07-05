<div align="center">

```text
███╗   ███╗  █████╗ ████████╗██╗  ██╗██╗ ██████╗ █████╗ ██╗     
████╗ ████║ ██╔══██╗╚══██╔══╝██║  ██║██║██╔════╝██╔══██╗██║     
██╔████╔██║ ███████║   ██║   ███████║██║██║     ███████║██║     
██║╚██╔╝██║ ██╔══██║   ██║   ██╔══██║██║██║     ██╔══██║██║     
██║ ╚═╝ ██║ ██║  ██║   ██║   ██║  ██║██║╚██████╗██║  ██║███████╗
╚═╝     ╚═╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
```

# Understand Mathematics Through AI Reasoning

### *An Agentic AI-powered mathematics learning platform.*

<p>
  <img src="https://img.shields.io/badge/Version-v1-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active%20Development-success?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Built%20With-LangGraph-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge"/>
</p>

</div>

---

# What is Mathical?

Mathematics is often taught by showing answers.

**Mathical is built to teach the reasoning behind them.**

Mathical is an **Agentic AI-powered learning platform** that transforms mathematical problem solving into an interactive learning experience.

Instead of relying on predefined solution templates or a single LLM prompt, Mathical orchestrates multiple AI-powered reasoning stages to analyze a problem, determine the solving strategy, generate structured explanations, identify concepts, recommend formulas, and reinforce learning through AI-generated practice.

The objective isn't simply to answer questions.

It's to help users understand **how** and **why** a solution works.

---

# The Problem

Most AI math tools today behave like chatbots.

```
Question
    │
    ▼
Large Language Model
    │
    ▼
Answer
```

While this is useful, it rarely focuses on learning.

Students often receive an answer without understanding:

- Why a method was chosen
- Which concepts are involved
- Which formulas are being applied
- What they should practice next

Mathical is designed to bridge that gap.

---

# How Mathical Works

Every problem passes through an intelligent reasoning workflow.

```text
Question
    │
    ▼
Problem Analysis
    │
    ▼
Reasoning Strategy
    │
    ▼
AI Solution Generation
    │
    ▼
Step-by-Step Explanation
    │
    ▼
Concept Identification
    │
    ▼
Formula References
    │
    ▼
Learning Resources
    │
    ▼
Practice Question Generation
    │
    ▼
Save to User History
```

Each stage contributes to a richer learning experience rather than simply producing an answer.

---

# Current Features

## AI Problem Solving

Generate detailed, structured, step-by-step mathematical solutions for a wide range of topics using dynamic AI reasoning.

---

## Intelligent Explanations

Every solution is accompanied by explanations designed to help users understand the logic behind each step instead of memorizing procedures.

---

## Concept Detection

Mathical automatically identifies the mathematical concepts involved in each question, making it easier to understand what is actually being tested.

---

## Formula References

Relevant formulas and mathematical identities are presented alongside the solution to reinforce conceptual understanding.

---

## Learning Resources

Receive additional learning references related to the concepts used within the solution.

---

## AI-Generated Practice

Once a problem is solved, Mathical generates practice questions that target the same concepts, encouraging active learning instead of passive reading.

---

## Solve History

Authenticated users have access to their complete solve history, allowing them to revisit previous solutions and continue learning over time.

---

## Secure Authentication

JWT-based authentication keeps user data isolated while enabling personalized experiences and persistent learning history.

---

# Agentic AI Workflow

Mathical is powered by an agentic workflow built using **LangGraph**.

Instead of treating every request as a single prompt, the platform divides the solving process into multiple reasoning stages.

Current workflow includes:

- Problem understanding
- Mathematical reasoning
- Explanation generation
- Concept extraction
- Formula retrieval
- Resource recommendation
- Practice generation
- History persistence

This modular architecture makes the platform easier to extend with additional agents and tools as the product evolves.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic

## AI

- LangGraph
- LangChain
- Large Language Models
- Agentic Workflows

## Database

- PostgreSQL

## Authentication

- JWT Authentication

---

# Project Structure

```text
mathical/

├── frontend/
│   ├── app/
│   ├── actions/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── app/
│   ├── agents/
│   ├── graph/
│   ├── database/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── utils/
│
├── docs/
├── screenshots/
└── README.md
```

---

# Version 1

Current development focuses on building the core AI reasoning engine and establishing the foundation of the platform.

Version 1 includes:

- Dynamic AI problem solving
- Structured explanations
- Concept identification
- Formula references
- Learning resources
- AI-generated practice
- User authentication
- Persistent solve history
- Responsive web application
- Agentic AI workflow

---

# Looking Ahead

The current architecture is designed to support future capabilities without requiring major changes to the core workflow.

Planned enhancements include image-based problem solving, handwritten mathematics recognition, PDF support, interactive visualizations, personalized learning, smarter agent collaboration, verification workflows, and additional AI tools.

---

<div align="center">

### **Teaching Mathematics Through Intelligent Reasoning.**

*Built with Python • FastAPI • LangGraph • LangChain • Next.js • TypeScript*

</div>
