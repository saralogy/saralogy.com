---
title: "GA4 Setup for German Companies: The GDPR-Compliant Configuration Guide"
publishedAt: "2026-06-17"
updatedAt: "2026-06-17"
intersects:
  - marketing
  - ai
excerpt: "Exact GA4 settings that violate GDPR in Germany and how to fix them. IP anonymization, cookie consent integration, data sharing settings, and BayLDA guidance on Google Analytics."
readingTime: 8
seo:
  title: "GA4 Setup for German Companies: The | Saralogy"
  description: "Exact GA4 settings that violate GDPR in Germany and how to fix them. IP anonymization, cookie consent integration, data sharing settings, and BayLDA guidance..."
status: "published"
featured: false
---

# GA4 Setup for German Companies: The GDPR-Compliant Configuration Guide

Google Analytics 4 is not GDPR-compliant out of the box in Germany. The default configuration sends data to Google servers, enables user-level tracking beyond what German DPA guidance permits, and includes data sharing settings that German companies have been specifically warned about.

This guide covers the exact settings to change, in the order to change them, with the specific German regulatory basis for each change.

---

## Background: The German DPA Problem with Google Analytics

The Bavarian State Office for Data Protection Supervision (BayLDA) issued specific guidance in 2022 and 2023 stating that the standard configuration of Google Analytics — specifically data transfers to US servers and the activation of features that create identifiable user profiles — violates GDPR Article 44 (transfers to third countries) and the German Federal Constitutional Court's interpretation of privacy rights.

The DSK (Datenschutzkonferenz, the coordination body for all German DPAs) issued a resolution confirming that website operators using Google Analytics must: implement IP anonymization, activate Consent Mode v2, and review all data sharing settings.

This guide implements those requirements.

---

## Section 1: GA4 Account-Level Settings

**Navigate to:** Admin > Account > Account Details (GA4 admin panel)

**Setting 1: Data Sharing Settings**

Path: Admin > Account > Account Details > Manage data sharing settings

Uncheck ALL of the following:
- "Google products & services" — This shares your analytics data with Google to improve their products. Under German data minimization principles (GDPR Art. 5(1)(c)), this is not necessary for your analytics purposes and should be disabled.
- "Benchmarking" — Disabled by default in some accounts; verify.
- "Technical support" — Can remain on (this is about allowing Google support to access your data when you request help; acceptable).
- "Account specialists" — Disable if you don't want Google sales representatives to access your data.

**Regulatory basis:** GDPR Art. 5(1)(c) data minimization principle, DSK resolution on Google Analytics usage in Germany (2023).

---

## Section 2: Property-Level Data Settings

**Navigate to:** Admin > Property > Data Settings

**Setting 2: Data Collection and Modification**

Path: Admin > Property > Data Settings > Data Collection

- **Google Signals:** Set to OFF. Google Signals enables cross-device tracking and ad personalization by linking GA4 data to Google Account users. This creates user profiles that German DPAs have identified as requiring explicit consent that most CMP implementations don't adequately collect. Leaving Google Signals ON with a standard cookie consent banner is a GDPR violation risk.

- **User-ID collection:** Leave as OFF unless you have a specific logged-in-user tracking requirement with explicit consent for user-ID-based tracking documented in your privacy policy.

**Regulatory basis:** BayLDA guidance on behavioral profiling, GDPR Art. 25 (privacy by design).

**Setting 3: Data Retention**

Path: Admin > Property > Data Settings > Data Retention

Set to 14 months (maximum available in standard GA4). Event data and user data are retained for this period. This is the minimum retention period that allows year-over-year comparison; it complies with GDPR data minimization requirements better than indefinite retention.

Do NOT enable "Reset user data on new activity" (this would effectively set retention to indefinite).

---

## Section 3: Data Stream Settings

**Navigate to:** Admin > Property > Data Streams > [Your Web Stream]

**Setting 4: IP Anonymization**

GA4 processes IP addresses as part of geolocation. The question of whether GA4 adequately anonymizes IPs is contested in German legal commentary.

Verify IP anonymization is active: In the Data Stream settings, under "Google tag > Configure tag settings," check that IP anonymization is listed as active. If you manage the tag via GTM, verify the GA4 Configuration tag has `anonymize_ip: true` as a field.

**Note:** GA4 processes IPs in memory and claims to anonymize before storage. The BayLDA's concern was about the transmission of IP to Google servers (even briefly) before anonymization. Consent Mode v2 (covered below) addresses this by not sending analytics data at all for non-consenting users.

**Setting 5: Consent Mode v2 Implementation**

Consent Mode v2 is required for GDPR-compliant Google Analytics usage in Germany since March 2024. Without it, GA4 collects data from users who have declined analytics cookies — which is a GDPR violation.

**Implementation options:**

*Option A: CMP-native implementation (recommended)*

Cookiebot (Cybot A/S) and Usercentrics (Usercentrics GmbH — German company) both have native Consent Mode v2 integration. When configured correctly:
1. When a user accepts analytics cookies → GA4 receives full behavioral data
2. When a user declines analytics cookies → GA4 receives a "denied" signal and collects no behavioral data; Consent Mode v2 models aggregate behavior for this user cohort
3. When a user makes no choice (before seeing the consent banner) → "Denied" state applies

**Cookiebot Consent Mode v2 setup:**
- Cookiebot Dashboard > Data Privacy > Consent Mode: Enable
- Select "Advanced" mode to properly send consent signals before GA4 loads
- Verify implementation with Google's Tag Assistant

**Usercentrics Consent Mode v2 setup:**
- Usercentrics Dashboard > Configuration > Integrations > Google Consent Mode
- Enable Consent Mode v2 signals
- Map Usercentrics consent categories to Google consent types (analytics_storage → "Statistics" category)

*Option B: Manual GTM implementation*

If not using a CMP with native Consent Mode v2 support:
1. Add a Consent Initialization trigger in GTM that fires before all other tags
2. Configure gtag to set default consent state to "denied" for analytics_storage and ad_storage
3. After user consents via your CMP, fire a consent update command to grant the relevant storage types

**Verification:** After implementation, use Google Tag Assistant > Preview mode to verify that:
- GA4 tag fires in "Granted" state for consenting users
- GA4 tag fires in "Denied" state (or doesn't fire) for non-consenting users
- Consent Mode signals appear in GA4 DebugView

---

## Section 4: Cookiebot-Specific Configuration

If using Cookiebot as your CMP, these additional settings reduce German compliance risk:

**Cookie declaration language:** Set to German (de-DE) so the cookie declaration is displayed in German — required for transparent disclosure under DSGVO.

**Scan domain:** Run a full cookie scan to identify all cookies set by your website and third-party scripts. Uncategorized cookies that fire before consent = GDPR violation.

**IAB TCF integration:** Enable TCF v2.2 in Cookiebot settings. This allows advertising platforms (Google, LinkedIn, Meta) to receive standardized consent signals for their specific data processing purposes.

---

## Section 5: User Deletion Process

GDPR Article 17 requires that you can delete a user's data within 30 days of a deletion request. For GA4:

**GA4 User Deletion API:** GA4 provides a User Deletion API that removes a specific user's data by user ID or client ID. Implementation requires: logging the GA4 client ID at contact form submission (captured via the `ga.getAll()[0].get('clientId')` JavaScript call), storing it in your CRM, and running the deletion API when a user submits a GDPR deletion request.

**If you don't implement the deletion API:** Document in your privacy policy that you retain GA4 data for 14 months and cannot delete individual user data within the GA4 system (because users are identified by anonymous client IDs, not personally identifiable information). This is a known limitation of standard GA4 implementation and is generally accepted by German DPAs as a practical limitation, provided: Google Signals is off (so GA4 data can't be linked to a Google Account), and IP anonymization is active.

---

## Verification Checklist

After completing setup, run through this checklist:

- [ ] Google Signals: OFF
- [ ] Data sharing with "Google products & services": OFF
- [ ] Data retention: 14 months
- [ ] IP anonymization: Verified active
- [ ] Consent Mode v2: Configured and verified in Tag Assistant
- [ ] Cookie scan: All cookies categorized in CMP
- [ ] German privacy policy: Updated to include GA4 processing description, Google LLC as data processor, and data retention period
- [ ] Test: Visit site in incognito, decline cookies, verify GA4 doesn't fire in Tag Assistant Preview
- [ ] Test: Accept cookies, verify GA4 fires correctly
- [ ] Test: Submit deletion request simulation, verify process works

---

For the [full GDPR compliance guide for marketing](/insights/gdpr-compliant-ai-marketing) covering all marketing tools.

The [marketing analytics stack for German teams](/insights/marketing-analytics-lean-stack) shows how GA4 fits with the full analytics setup.

For [attribution using GA4 for German B2B](/insights/marketing-attribution-b2b-germany) — how to interpret GA4 data in long sales cycle contexts.

[AI marketing consulting](/ai-marketing-dach): GDPR compliance review included in all Phase 1 engagements.

---

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "GA4 Setup for German Companies: The GDPR-Compliant Configuration Guide",
  "description": "Exact GA4 settings that violate GDPR in Germany and how to configure them correctly. Based on BayLDA guidance and DSK resolution on Google Analytics.",
  "url": "https://saralogy.com/insights/ga4-gdpr-germany-setup",
  "datePublished": "2026-06-17",
  "dateModified": "2026-06-17",
  "author": {"@type": "Person", "@id": "https://saralogy.com/about#person", "name": "Berk Saraloglu"},
  "publisher": {"@type": "Organization", "@id": "https://saralogy.com#organization", "name": "Saralogy"},
  "mainEntityOfPage": {"@type": "WebPage", "@id": "https://saralogy.com/insights/ga4-gdpr-germany-setup"},
  "inLanguage": "en"
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Configure GA4 for GDPR Compliance in Germany",
  "description": "Step-by-step GA4 configuration for German GDPR compliance including Consent Mode v2.",
  "url": "https://saralogy.com/insights/ga4-gdpr-germany-setup",
  "step": [
    {"@type": "HowToStep", "position": 1, "name": "Disable Google data sharing", "text": "Admin > Account > Data Sharing: Uncheck 'Google products & services' and 'Benchmarking'"},
    {"@type": "HowToStep", "position": 2, "name": "Turn off Google Signals", "text": "Admin > Property > Data Settings > Data Collection: Set Google Signals to OFF"},
    {"@type": "HowToStep", "position": 3, "name": "Set data retention to 14 months", "text": "Admin > Property > Data Settings > Data Retention: Set to 14 months"},
    {"@type": "HowToStep", "position": 4, "name": "Verify IP anonymization", "text": "Check GA4 tag settings for anonymize_ip: true. Verify in Tag Assistant."},
    {"@type": "HowToStep", "position": 5, "name": "Implement Consent Mode v2", "text": "Configure your CMP (Cookiebot or Usercentrics) to send Consent Mode v2 signals to GA4. Verify non-consenting users produce no GA4 data."},
    {"@type": "HowToStep", "position": 6, "name": "Run verification checklist", "text": "Test in incognito mode: decline cookies → verify GA4 doesn't fire. Accept cookies → verify GA4 fires correctly."}
  ]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://saralogy.com"},
    {"@type": "ListItem", "position": 2, "name": "Insights", "item": "https://saralogy.com/insights"},
    {"@type": "ListItem", "position": 3, "name": "GA4 Setup for German Companies", "item": "https://saralogy.com/insights/ga4-gdpr-germany-setup"}
  ]
}
```
