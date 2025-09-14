# Mind Gleam — Global Compliance Blueprint

*Version 0.1  (Last updated: 13 July 2025)*

> **Goal**  Provide a single, living reference that keeps Mind Gleam well outside formal medical‑device regulation while meeting privacy, consumer‑protection and platform requirements everywhere we ship.\
> **Use**  Treat this file as *source‑of‑truth*: every new feature or marketing claim must be cross‑checked here **before** release.\
> **Update cadence**  Review quarterly or when a new jurisdiction/feature is added.

---

## 1  Scope & Purpose

| 🗂️ Section                       | What it covers                                                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2. Feature‑to‑Claim Matrix**    | Inventory of every user‑facing feature and the *exact* wording we may use in UI / marketing. Shows why each claim is *non‑therapeutic*.                                 |
| **3. Decision Memo Template**     | Two‑page template to evidence why Mind Gleam is *not* Software‑as‑a‑Medical‑Device (SaMD) under major regimes (AU, US, EU, UK, etc.). Attach one per major app version. |
| **4. Legal Disclaimers**          | Copy‑and‑paste strings for app screens, marketing pages and T&C.                                                                                                        |
| **5. Privacy & Data Protection**  | APP/GDPR baseline policy + required local annexes.                                                                                                                      |
| **6. Crisis‑Support Banner**      | Geo‑aware helpline list.                                                                                                                                                |
| **7. Platform Compliance Log**    | Apple / Google review artefacts.                                                                                                                                        |
| **8. Change‑Control & Audit Log** | How we freeze, tag and store evidence.                                                                                                                                  |
| **9. Roadmap to SaMD (optional)** | Steps if we ever pivot into regulated territory.                                                                                                                        |

---

## 2  Feature‑to‑Claim Matrix

> Add rows **every time** a new feature or marketing claim is proposed.

| # | Feature               | Allowed Public Claim (≤ 120 chars)                   | Regulatory Category          | Justification / Reference                                                                                                                                                                                                                                                    |
| - | --------------------- | ---------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | 5‑Step Thought Record | “Guided self‑reflection to spot unhelpful thoughts.” | *Wellness / self‑help*       | Follows RANZCP CBT guide; no diagnosis, no treatment. [https://www.ranzcp.org/files/resources](https://www.ranzcp.org/files/resources)                                                                                                                                       |
| 2 | Daily Mood Check‑in   | “Track your mood trends over time.”                  | *Wellness / self‑monitoring* | TGA Exclusion – uses *user reported* feelings only. [https://www.tga.gov.au/sites/default/files](https://www.tga.gov.au/sites/default/files)                                                                                                                                 |
| 3 | AI Companion Chat     | “Get science‑backed prompts for calmer thinking.”    | *Wellness coaching*          | Provides generic coping statements; no medical advice. FDA General Wellness guidance. [https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness) |
| … | …                     | …                                                    | …                            | …                                                                                                                                                                                                                                                                            |

*How to use*: copy the table into a PR description; reviewers tick ✅ once wording is verified compliant.

---

## 3  Regulatory Decision Memo — Template

```
Mind Gleam vX.Y.Z – SaMD Determination Memo
Date: <YYYY‑MM‑DD>
Author: <name>

1. Intended Purpose Statement (exact words shown to users)
2. Feature Overview (bullet list)
3. Jurisdiction Analysis
   3.1 AU – TGA flow‑chart outcome: Excluded ☐ / Included ☐ (Class ☐)
   3.2 US – FDA: General Wellness ☐ / 510(k) ☐
   3.3 EU – MDR: Not a medical device ☐ / Class IIa ☐
   …
4. Supporting Evidence
   • References to clinical guidelines cited in UI
   • Screenshots of disclaimers
5. Conclusion & Sign‑off
   Product Owner ____   Legal ____   💾 Stored in /compliance/memos
```

---

## 4  Legal Disclaimers (copy verbatim)

### 4.1  General Disclaimer (shown on onboarding, settings & website footer)

> Mind Gleam offers self‑help tools and educational content only. It is **not a medical device** and does not diagnose, treat, cure or prevent any disease or mental‑health condition. If you feel unsafe or in crisis, call your local emergency number immediately.

### 4.2  Emergency Banner (geo‑aware)

```
🇦🇺 Need help now?  Call 000 or Lifeline 13 11 14
🇺🇸 Call 911 or 988 (Suicide & Crisis Lifeline)
🇬🇧 Call 999 or Samaritans 116 123
🇪🇺 European Helpline 116 123
```

*Implementation hint*: `getCountryCode()` → pick banner line.

### 4.3  Marketing Copy Do‑Not‑Use List

| ❌ Banned phrase                         | ✅ Compliant alternative                     |
| --------------------------------------- | ------------------------------------------- |
| “Clinically proven to treat depression” | “Based on cognitive‑behavioural principles” |
| “Diagnosis in seconds”                  | “Helps you spot thinking patterns”          |

---

## 5  Privacy & Data Protection Baseline

### 5.1  Policy Skeleton (APP + GDPR ready)

1. **Who we are** – Mind Gleam Pty Ltd, ABN …
2. **What data we collect** – email, password (hashed), mood logs, chat transcripts.
3. **Why we collect it** – provide service, improve features, comply with law.
4. **Legal bases** (GDPR) – consent, legitimate interest, contractual necessity.
5. **Sensitive data** – affirmative consent checkbox for mood logs & notes.
6. **Storage & Security** – Supabase (Sydney), AES‑256 at rest, TLS 1.3 in transit.
7. **User rights** – access, correction, deletion, export (JSON), withdraw consent.
8. **International transfers** – Standard Contractual Clauses for EU data.
9. **Data retention** – 30 days after account deletion, then secure purge.
10. **Contact** – [privacy@mindgleam.app](mailto\:privacy@mindgleam.app) | OAIC complaint route.

### 5.2  Jurisdiction Annexes

- **California (CCPA/CPRA)** – “Do Not Sell or Share My Info” link; honour GPC header.
- **Brazil (LGPD)** – Portuguese rights notice.
- **India (DPDPA 2023)** – redefine “Data Fiduciary”, list grievance officer.

---

## 6  App‑Store Compliance Log

| Date | Store  | Build # | Status | Reviewer Questions & Our Answers |
| ---- | ------ | ------- | ------ | -------------------------------- |
|      | Apple  |         |        |                                  |
|      | Google |         |        |                                  |

*Store artefacts saved in **`/compliance/app-store/<build>`**.*

---

## 7  Change‑Control & Audit Log

- Use Git tags `compliance-v<version>`.
- Store signed PDFs of each Decision Memo in `/legal/archive` (AWS S3, Glacier).
- Monthly `cron` dumps DB schema + security settings to `/evidence`.

---

## 8  Roadmap to SaMD (future‑proof)

| Milestone | Action                           | Notes                                                                                  |
| --------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| Q1 2026   | Implement ISO 13485 QMS skeleton | Gap‑analysis template stored in `/qms`                                                 |
| Q2 2026   | Pilot clinical‑outcomes study    | Ethics protocol draft [https://www.hrecsupport.edu.au](https://www.hrecsupport.edu.au) |
| …         | …                                | …                                                                                      |

---

## 9  Key References (long URLs)

1. TGA Guidance: *Regulation of software for clinical purposes*\
   [https://www.tga.gov.au/sites/default/files/regulation‑of‑software‑based‑medical‑devices.pdf](https://www.tga.gov.au/sites/default/files/regulation‑of‑software‑based‑medical‑devices.pdf)
2. FDA Guidance: *General Wellness: Policy for Low Risk Devices*\
   [https://www.fda.gov/media/90652/download](https://www.fda.gov/media/90652/download)
3. EU MDR Text (Official Journal L 117)\
   [https://eur‑lex.europa.eu/legal‑content/EN/TXT/PDF/?uri=CELEX:32017R0745](https://eur‑lex.europa.eu/legal‑content/EN/TXT/PDF/?uri=CELEX:32017R0745)
4. MHRA Guidance: *Medical device stand‑alone software including apps*\
   [https://assets.publishing.service.gov.uk/media/5f6211ebd3bf7f5b723b7c18/software‑applications‑medical‑devices‑guidance.pdf](https://assets.publishing.service.gov.uk/media/5f6211ebd3bf7f5b723b7c18/software‑applications‑medical‑devices‑guidance.pdf)
5. OAIC APP Guidelines\
   [https://www.oaic.gov.au/privacy/australian‑privacy‑principles‑guidelines](https://www.oaic.gov.au/privacy/australian‑privacy‑principles‑guidelines)

---

> **Next actions**\
> • Product team: append every existing feature to Section 2 by 20 July 2025.\
> • Legal: draft full Privacy Policy using Section 5 skeleton.\
> • Engineering: embed Disclaimer 4.1 + Banner 4.2 in onboarding flow (ticket #COM‑07).

