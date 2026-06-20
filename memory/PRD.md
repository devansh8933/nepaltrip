# Nepal Trip — PRD

## Original Problem Statement
Build a premium, modern, SEO-optimized tour & travel website for **Nepal Trip** (a Gorakhpur-based travel agency). Mountain-blue + crimson/saffron Nepal-inspired palette, FastAPI + React + MongoDB.

Header: Home, About Us, Packages, Services, Testimonials, Contact Us.
Hero slider: Nepal mountain, Kashmir, Kailash Mansarovar, Kathmandu, Pokhara.
Each Service (8) and Package (15: 7 city + 8 theme) must open a separate page with **unique SEO blog content** + contact form (name/email/mobile/description) + WhatsApp link to **+91 9580261255**.
Testimonials in **Hinglish** from "Raj Gopal Yadav" and "Deepak Singh".
Form submission stores in MongoDB + popup toast "we will contact you soon".

## User Choices Captured
- Form submissions → MongoDB only
- Hero images → Unsplash / Pexels
- WhatsApp → +91 9580261255
- Colors → Mountain blues + earthy tones + Nepal-flag crimson/saffron
- Blogs → substantial unique SEO content per page

## Architecture
- **Backend**: FastAPI (`/app/backend/server.py`)
  - `GET /api/` health welcome
  - `GET /api/health`
  - `POST /api/leads` — name, email, mobile, description, subject, category (service|package|general), slug
  - `GET /api/leads?category=…&limit=…`
- **Frontend**: React Router with routes
  - `/`, `/about`, `/services`, `/services/:slug`, `/packages`, `/packages/:slug`, `/testimonials`, `/contact`
- **Design system**: Cormorant Garamond + Manrope · primary `#1C3144`, accent `#DC143C`, gold `#EAA015`, background `#FAFAF8`.

## Implemented (2026-12)
- Hero slider with auto-cycle, prev/next + dots
- About section (home preview + full /about page) with "Click here to see more" CTA
- 8 Services with unique SEO blog content (≈3 paragraphs each, keyword-distributed)
- 15 Packages (7 cities + 8 categories) with unique SEO blogs
- Reusable LeadForm (card + dark variants) wired to `/api/leads`
- Sonner toast confirmation, WhatsApp link prompt under every form
- Floating WhatsApp button (animated)
- Testimonials in Hinglish for Raj Gopal Yadav & Deepak Singh
- Sticky glass header with mobile menu, accessible nav
- SEO meta tags + keyword-rich title + descriptions
- Patched craco.config.js for webpack-dev-server v5 compatibility

## Verified
- Backend: 9/9 pytest pass — POST/GET leads, validation, category filter (testing iteration_1)
- Frontend: hero slider, all routes, every service & package detail, all forms submit + persist, mobile menu, WhatsApp link

## Backlog (Next phase)
- **P0**: Admin auth gate on `GET /api/leads` (currently public — PII risk)
- **P1**: Email notification on lead submission (Resend/SendGrid)
- **P1**: Use `EmailStr` for stronger validation in Pydantic models
- **P1**: Online booking / quote calculator
- **P2**: Blog/CMS section, sitemap.xml, robots.txt
- **P2**: Image gallery per package
- **P2**: Reviews ingestion from Google Reviews
- **P2**: Multi-language (Hindi/Nepali)
