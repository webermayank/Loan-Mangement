# LoanOS - Loan Management System

A polished full-stack Loan Management System for the college assignment. It includes a borrower portal, server-side BRE eligibility checks, salary slip upload, loan calculator, JWT auth, bcrypt password hashing, MongoDB persistence, and role-based operations dashboards.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, TypeScript
- Database: MongoDB with Mongoose
- Auth: JWT in httpOnly cookie, bcrypt password hashing
- Uploads: Multer, local `backend/uploads`

## Quick Start

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

3. Create environment files:

```bash
cp ../.env.example ../backend/.env
cp ../.env.example .env.local
```

4. Start MongoDB locally, then seed the database:

```bash
cd ../backend
npm run seed
```

5. Run both apps:

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd frontend
npm run dev
```

Open `http://localhost:3000`.

## Seeded Accounts

All accounts use `Password@123`.

| Role | Email |
|---|---|
| Borrower | `borrower@lms.com` |
| Sales | `sales@lms.com` |
| Sanction | `sanction@lms.com` |
| Disbursement | `disburse@lms.com` |
| Collection | `collection@lms.com` |
| Admin | `admin@lms.com` |

The seed also creates sample applications in applied, sanctioned, and disbursed states so each operations module has demo data.

## BRE Rules

The backend is the source of truth. An applicant is rejected when:

- Age is not between 23 and 50
- Monthly salary is below INR 25,000
- PAN format is invalid
- Employment mode is unemployed

## Loan Math

The app uses fixed 12% p.a. simple interest:

```text
SI = (P x R x T) / (365 x 100)
Total Repayment = P + SI
```

Loan amount range is INR 50,000 to INR 5,00,000. Tenure range is 30 to 365 days.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/borrower/personal-details`
- `POST /api/borrower/salary-slip`
- `POST /api/borrower/loan-config`
- `POST /api/borrower/apply`
- `GET /api/borrower/application`
- `GET /api/ops/leads`
- `GET /api/ops/sanction`
- `PATCH /api/ops/sanction/:id`
- `GET /api/ops/disbursement`
- `PATCH /api/ops/disbursement/:id/disburse`
- `GET /api/ops/collection`
- `POST /api/ops/collection/:id/payment`
- `GET /api/ops/admin/applications`
- `GET /api/ops/admin/users`

## Verification Flow

1. Register or login as borrower.
2. Complete personal details with valid PAN like `ABCDE1234F`, salary above INR 25,000, age 23-50, and salaried/self-employed mode.
3. Upload a PDF/JPG/PNG salary slip under 5 MB.
4. Configure amount and tenure, then submit.
5. Login as sanction and approve the application.
6. Login as disbursement and mark it disbursed.
7. Login as collection and record payments with unique UTR values.
8. When total paid reaches total repayment, the backend marks the loan closed.
