# Digital Health UniMelb — ePRO-CTCAE Prototype

An interactive, dual-portal digital health prototype exploring electronic patient-reported symptom monitoring in oncology.

## Live prototype

[Open the public GitHub Pages prototype](https://hououjifuu.github.io/digital-health-unimelb-epro-ctcae/)

## Prototype experience

### Patient portal

- English weekly symptom check-in using a 7-day recall period
- Step-by-step symptom questions and completion progress
- Submission confirmation and safety messaging
- Responsive layouts for desktop and mobile

### Care-team portal

- Patient cohort overview ordered by a simulated attention score
- Symptom trend visualisation
- Rule-based review alerts and acknowledgement flow
- Simulated patient, protocol and treatment-cycle data

## Important disclaimer

This is an educational prototype only. It uses simulated data, does not provide medical advice, and is not intended for clinical decision-making. Prototype attention scores and alerts are not CTCAE grades and must not replace clinical assessment.

The product concept is informed by the U.S. National Cancer Institute's [PRO-CTCAE Measurement System](https://healthcaredelivery.cancer.gov/pro-ctcae/measurement.html). A production or research implementation would require use of authorised instrument wording, clinical governance, privacy and security review, accessibility testing, and appropriate ethics approval.

## Run locally

Requirements: Node.js 22.13 or later.

```bash
pnpm install
pnpm run dev
```

Build the deployment bundle with:

```bash
pnpm run build
```

The GitHub Pages bundle is generated with `pnpm run build:pages` and published from the repository's `docs/` directory.

## Technology

- React 19
- TypeScript
- vinext / Vite
- Cloudflare Workers-compatible output
