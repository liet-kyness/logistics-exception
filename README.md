# Logistics Exception Monitoring App

A full-stack internal tool that simulates how logistics operations teams monitor, triage, and resolve shipment exceptions.

## Overview

This project models a real-world exception management workflow used in logistics, transportation management systems (TMS), and operations environments.

It allows users to:

- monitor active shipment exceptions
- track SLA breaches
- filter and search exception queues
- inspect retry history and status transitions
- analyze operational metrics

## Tech Stack

### Backend
- Node.js + Fastify
- TypeScript
- PostgreSQL
- Drizzle ORM

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS

## Features

### Exception Queue
- filter by status and severity
- search by exception ID, shipment ID, or carrier
- SLA status indicators (Healthy / At Risk / Breached)

### Exception Detail View
- shipment context
- retry history
- status lifecycle tracking
- resolution notes

### Operational Dashboard
- active exceptions
- SLA breaches
- average resolution time
- breakdown by category and severity

## Data Model

Core entities:

- `shipments`
- `exceptions`
- `exception_retries`
- `status_history`

Designed to reflect real logistics workflows including retry handling and SLA tracking.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

---

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/logistics-exception-app.git
cd logistics-exception-app