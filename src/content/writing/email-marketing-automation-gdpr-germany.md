---
title: "Email Marketing Automation Under GDPR for German Companies"
publishedAt: "2026-06-17"
updatedAt: "2026-06-17"
intersects:
  - marketing
  - ai
excerpt: "Double opt-in requirements, consent documentation, §7 UWG obligations, and how to structure automation sequences that pass German DPA review."
readingTime: 8
seo:
  title: "Email Marketing Automation Under GDPR: The | Saralogy"
  description: "Double opt-in requirements, consent documentation, §7 UWG obligations, and how to structure automation sequences that pass German DPA review."
status: "published"
featured: false
---

# Email Marketing Automation Under GDPR for German Companies

The most common German marketing automation GDPR violation isn't data storage in the US or missing DPAs. It's sending marketing emails to a contact list assembled from trade shows, LinkedIn exports, and "relationship" contacts who were never asked to opt in to marketing communications.

This violation is structural and widespread — it's the default state of most German B2B CRM systems — and it makes every automation built on top of it non-compliant regardless of how correctly the automation itself is configured.

This guide addresses the compliance foundation first, then the automation architecture.

---

## The German Email Marketing Legal Stack

German email marketing operates under two legal frameworks simultaneously:

**GDPR (EU-wide).** Article 6 requires lawful basis for processing contact data. For marketing email, consent (Art. 6(1)(a)) is the most defensible basis. Legitimate interest (Art. 6(1)(f)) is arguable for some B2B email marketing contexts but requires a documented Legitimate Interest Assessment and is regularly challenged by German DPAs.

**§7 UWG (Germany-specific).** The German Unfair Commercial Practices Act, §7, prohibits "undue harassment" — which German courts have interpreted as requiring explicit prior consent for electronic marketing communications (email, SMS, push notifications). The §7 UWG consent requirement applies independently of GDPR and is enforced by German courts through competitor complaints, not just DPA investigation.

The practical implication: German email marketing requires documented consent under BOTH frameworks. GDPR consent alone (single opt-in) is not sufficient under German law. §7 UWG requires the additional protection of double opt-in confirmation.

**Why double opt-in is required in Germany.** This is the most important single fact about German email marketing compliance. Double opt-in — where a subscriber receives a confirmation email and must click a link to complete their registration — is not a GDPR requirement universally. But German courts and the German DPAs have consistently treated it as the minimum compliant implementation for §7 UWG. A German court in 2021 (BGH, I ZR 67/20) confirmed that consent for commercial email communications requires positive affirmation beyond just providing an email address.

---

## Double Opt-In Implementation Requirements

**The confirmation email.** The confirmation email must: arrive within minutes of the initial opt-in action (delays cause drop-off and raise legal questions about whether the confirmation is valid), contain a clear description of what the subscriber is consenting to, include a confirmation link that expires within 24–48 hours (indefinitely valid confirmation links are a minor compliance risk), and not contain marketing content (the confirmation email is an administrative communication, not a marketing opportunity).

**The consent documentation.** For every subscribed contact, your CRM must store:
- Timestamp of initial opt-in (when they submitted the form)
- Timestamp of confirmation click (when they clicked the double opt-in link)
- Subscription source (which form, which campaign, which page)
- Subscription type (which content they subscribed to — "newsletter," "product updates," "case studies" — if you have multiple lists)
- IP address at opt-in (for verification purposes, though storing IP addresses itself requires GDPR consideration — anonymize if possible)

**Consent scope.** Consent is specific to the purpose it was given for. If someone subscribed to your "monthly newsletter," that consent does not cover your "product launch announcement" list. German DPAs have enforced this granularity. If you send marketing emails from multiple lists, each list requires its own documented consent basis.

---

## Building GDPR-Compliant Automation Sequences

With compliant contact data as the foundation, automation sequences can be built. The sequence architecture that passes German DPA review:

**Trigger requirement.** Every automation trigger must filter to only fire for contacts with confirmed double opt-in consent. In HubSpot: add contact property filter "Marketing email subscription" = "Subscribed." In Brevo: automation triggers from contacts in confirmed double opt-in lists only. This filter is the single most important configuration in a German marketing automation system.

**Suppression list management.** Unsubscribe processing must be immediate upon action — the confirmation of unsubscribe goes out immediately, the contact is moved to suppression list within 24 hours maximum (German DPA guidance recommends immediate processing). The 30-day processing window that some non-German tools default to is not acceptable under German law.

**Sequence content and frequency.** No specific legal maximum on email frequency exists in GDPR or §7 UWG, but German courts have found that high-frequency unsolicited emails (not opted in specifically for that frequency) constitute "undue harassment." Practical guideline: more than 3 marketing emails per week to the same contact is legally risky without explicit consent for that frequency. B2B automation sequences in Germany typically run weekly at most.

**Re-consent campaigns.** For legacy contact lists assembled before proper consent infrastructure was in place: a re-consent campaign sends a single email to these contacts asking them to confirm their interest in receiving future communications. Contacts who don't respond within 30 days are moved to suppression. This is the GDPR-compliant path to cleaning up legacy lists.

---

## GDPR Article 22 and Automated Decisions in Email Marketing

Most email automation does not trigger Article 22 — because the decisions (which email a contact receives, which segment they're in) don't "significantly affect" the individual in the ways Article 22 is concerned with (credit decisions, employment decisions, insurance decisions).

However, if your automation includes: blocking contacts from receiving offers based on their behavioral score, automatically moving contacts to a "lost" CRM stage based on email engagement metrics, or making decisions that affect their access to company communications — the Article 22 analysis should be done explicitly. Document that a human can override any automated decision affecting a specific contact.

---

## Tool Configuration for German Compliance

**HubSpot — GDPR-critical settings:**
- Subscription types: create separate subscription types for each distinct email list (Newsletter, Product Updates, Events). Each requires separate consent.
- Double opt-in: Settings > Marketing > Email > Subscriptions > Enable double opt-in for all subscription types.
- GDPR feature: Settings > Privacy & Consent > GDPR > Enable. This enables consent tracking fields on all forms.
- Legal footer: Every marketing email must include company name, address, and unsubscribe link — not just an unsubscribe link.

**Brevo — GDPR-critical settings:**
- Double opt-in: Templates > Subscription Forms > Enable double opt-in confirmation. Configure the confirmation email template.
- Consent storage: Brevo stores subscription confirmation timestamps by default. Verify in Contact > Contact Lists.
- Suppression list: Settings > Email Compliance > Blocklist — ensure your import process checks against this list.

**German company footer requirement.** Every commercial email from a German company (or a company marketing to German recipients) requires by law (§5 TMG — German Telemedia Act): company legal name, registered address, Geschäftsführer (managing director) name, Handelsregister number and location, VAT ID (Umsatzsteuer-ID). This is separate from the GDPR unsubscribe requirement and applies to all commercial emails regardless of automation platform.

---

## Common Violations and How to Fix Them

**Violation 1: Automation sending to contacts without double opt-in.** Fix: audit every automation in your system, add confirmed subscription status filter to every trigger.

**Violation 2: Old trade show contact list in nurture sequences.** Fix: run re-consent campaign, suppress non-responders, never add unconfirmed contacts to marketing automation.

**Violation 3: Different subscription types sharing one consent record.** Fix: create separate subscription types for each email list, migrate contacts to the appropriate subscription type with consent documentation.

**Violation 4: Suppression list not processed within 24 hours.** Fix: configure automation to immediately add unsubscribed contacts to suppression list at the moment of unsubscribe click (most platforms support this with a workflow: "Contact unsubscribes" → "Add to suppression list").

**Violation 5: Missing company footer information in marketing emails.** Fix: update email templates to include full §5 TMG company information in email footer.

---

For the broader [marketing automation implementation guide for Germany](/insights/marketing-automation-germany) — where email automation sits within the full automation architecture.

The [full GDPR compliance guide for AI marketing](/insights/gdpr-compliant-ai-marketing) covers the legal framework for each common marketing activity.

For [CRM automation for small teams](/insights/crm-automation-small-marketing-team) — including double opt-in setup in Brevo and HubSpot.

[AI marketing consulting](/ai-marketing-dach): GDPR compliance review included in all engagement phases.

---

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Email Marketing Automation Under GDPR for German Companies",
  "description": "Double opt-in requirements, consent documentation, §7 UWG obligations, and how to structure automation sequences that pass German DPA review.",
  "url": "https://saralogy.com/insights/email-marketing-automation-gdpr-germany",
  "datePublished": "2026-06-17",
  "dateModified": "2026-06-17",
  "author": {"@type": "Person", "@id": "https://saralogy.com/about#person", "name": "Berk Saraloglu"},
  "publisher": {"@type": "Organization", "@id": "https://saralogy.com#organization", "name": "Saralogy"},
  "mainEntityOfPage": {"@type": "WebPage", "@id": "https://saralogy.com/insights/email-marketing-automation-gdpr-germany"},
  "inLanguage": "en"
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is double opt-in required for email marketing in Germany?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, in practice. While GDPR alone doesn't mandate double opt-in, German courts and DPAs have consistently treated it as the minimum compliant implementation for §7 UWG (German Unfair Commercial Practices Act), which requires explicit prior consent for electronic marketing communications. The BGH ruling I ZR 67/20 (2021) confirmed this standard."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use trade show contacts for email marketing in Germany?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not without a re-consent campaign. Trade show badge scans and business card exchanges don't meet the §7 UWG consent standard for marketing email. You must send a re-consent email asking contacts to confirm their subscription. Non-responders must be suppressed."
      }
    },
    {
      "@type": "Question",
      "name": "What must be in the footer of every marketing email sent from Germany?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under §5 TMG (German Telemedia Act): company legal name, registered address, managing director (Geschäftsführer) name, Handelsregister number and court, and VAT ID (Umsatzsteuer-ID). Plus: unsubscribe link (GDPR requirement). Missing any of these is a violation of German commercial communication law."
      }
    }
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
    {"@type": "ListItem", "position": 3, "name": "Email Marketing Automation Under GDPR for German Companies", "item": "https://saralogy.com/insights/email-marketing-automation-gdpr-germany"}
  ]
}
```
