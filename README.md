# FloodAids Pakistan

Offline-first flood relief coordination portal for public aid requests, field teams, NGOs, government schemes, private donors, and administrators.

This repository currently runs as a complete localhost demo. It includes seeded mock data, role-based demo access, IndexedDB field storage, local mock API persistence, biometric duplicate checks, and a documented path to a real backend.

## Quick Start

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:3000/`. If that port is busy, Vite selects the next available port.

Production checks:

```bash
npm run lint
npm run build
```

## Demo Access

The public portal opens without login. Use **Team login** in the header for protected workspaces.

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| Admin | `admin@floodaids.local` | `admin123` | All household verification, team directory, donor contacts, and assignments |
| NGO | `ngo@prcs.local` | `ngo123` | PRCS organization-scoped records |
| Government | `government@pdma.local` | `gov123` | PDMA government-scheme records |
| Private donor | `donor@community.local` | `donor123` | Own contribution feed and dummy donation form |
| Field team | `team.dadu@prcs.local` | `team123` | Team-scoped survey and aid-provided upload workspace |

The accounts are local demo identities, not real email accounts.

## Main Workspaces

### Public portal

Public users can browse relief zones, shelters, stories, achievements, and the public ledger without entering an email. They can also submit an emergency aid request.

### Admin Control Room

Admins can review all organization records, household status, verification state, team contacts, portal names, capabilities, current tasks, donor contacts, and demo task assignments. Admin users do not see donor contribution controls.

### Organization Dashboard

NGO and government users only see records filtered by their `organizationId`. Team and area metadata further scopes field operations.

### Private Donor Dashboard

Donors only see their own contribution history, target areas, purposes, statuses, total PKR, and the responsive dummy contribution form.

### Team Workspace

Field teams only see submissions for their `teamId`. They can upload:

- Household surveys
- Aid-provided reports
- Household name and village
- Family size and home status
- Items provided and field notes

## Data Storage

### Local field storage

- Household records: browser `IndexedDB`, database `FloodAidsFieldDB_v1`, store `beneficiaries`.
- Offline upload queue: IndexedDB `syncQueue`, records marked `pending_cloud_sync`.
- Biometric and audit blocks: IndexedDB `tamperBlocks`.
- Cryptographic verification: SHA-256 block integrity before reconciliation.

### Local mock backend

- Partner/admin household data: `localStorage` key `floodaids-demo-beneficiaries-v1`.
- Donor contributions: `localStorage` key `floodaids-demo-donations-v1`.
- Team survey and aid reports: `localStorage` key `floodaids-demo-team-submissions-v1`.
- Login session: `localStorage` key `floodaids-demo-session`.

The local mock data survives page refreshes in the same browser profile.

## Sync Flow

1. A field worker submits a household record.
2. The record is written to IndexedDB and queued as `pending_cloud_sync`.
3. Offline mode keeps the record on the device and can broadcast it over the local P2P mesh.
4. When the device returns online, the SHA-256 block is verified.
5. The record is sent to the configured backend and marked `synced` locally.
6. Without `VITE_API_BASE_URL`, the same operation is simulated through localStorage.

Donor and team dashboards perform live-style refreshes through the same adapter. In demo mode those requests read localStorage; in real mode they use the API below.

## Backend API Contract

Set an API base URL to replace the mock adapter:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

Expected endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/beneficiaries` | Sync a verified field disbursement |
| `GET` | `/api/admin/beneficiaries` | Admin-only cross-organization records |
| `PATCH` | `/api/admin/beneficiaries/:recordId/verification` | Update home and verification status |
| `GET` | `/api/donors/:organizationId/contributions` | Donor-scoped contribution feed |
| `POST` | `/api/donations` | Create a donor contribution |
| `GET` | `/api/teams/:teamId/submissions` | Team-scoped field submissions |
| `POST` | `/api/team-submissions` | Upload a survey or aid-provided report |

## Authorization Requirements

The current login is deliberately dummy/local for demonstration. A production backend must enforce authorization on the server, not rely on frontend filtering.

- Admin: access to all operational records and assignment tools.
- NGO, government, private donor: access only to their own `organizationId`.
- Field team: access only to its `teamId` and assigned `areaId`.
- Public users: no private dashboard or organization data.
- Duplicate aid: enforce unique identity/CNIC rules and biometric review across organizations.
- Donor privacy: keep contribution history separate from admin household data unless explicit audit permission exists.

## Project Structure

```text
src/
  backend/          Mock/real API adapter
  components/       Navigation, field terminal, forms, and shared UI
  data/             Relief data and team/donor directory fixtures
  engine/           IndexedDB, cloud sync, biometrics, crypto, and P2P mesh
  pages/            Public, admin, donor, organization, and team workspaces
  store/            Zustand auth, language, image, and field-worker state
  types/            Relief access, household, donor, and team contracts
```

## Important Note

This is a working localhost demonstration, not a production humanitarian data system. Do not place real CNICs, biometric photos, donor payment details, or beneficiary PII in mock storage. Before deployment, add real authentication, HTTPS, encrypted storage, server-side authorization, audit logging, data retention rules, and a protected database.
