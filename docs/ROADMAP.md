# FraudShield AI product roadmap

## Completed in this repository

- [x] Responsive demo dashboard, risk insights, activity charts, transaction table
- [x] Synthetic transaction simulation and explanation drawer
- [x] Analyst feedback flags and CSV export
- [x] Dedicated Supabase project, email/password integration and owner-scoped RLS
- [x] Modular React components/pages and optional Express demo API source
- [x] Shared scoring library and initial Node unit tests
- [x] Architecture, database, security and deployment documentation

## Ready for next phase (not done)

- [ ] CI install/build checks run green on GitHub Actions
- [ ] Full manual registration and logged-in user-flow testing
- [ ] Verify two-account RLS isolation in a browser
- [ ] Deploy frontend and optional backend to Render
- [ ] Configure Supabase production redirect URLs and Render CORS origins
- [ ] Confirm backend health and UI workflow on public HTTPS URLs

## Research and development opportunities

- [ ] Create an anonymized/labeled fraud dataset and ethical evaluation plan
- [ ] Benchmark precision/recall, investigate false-positive rate and class imbalance
- [ ] Build a separately deployable ML inference service and model versioning
- [ ] Add model explanations and audit trail with explicit limitations
- [ ] Implement role-based investigation workflow with independent RLS evaluation
- [ ] Add Playwright browser tests, dependency locks, accessibility audit and monitoring

Only mark a task complete once verified; file count alone is not progress.