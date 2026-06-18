// Ideal Customer Profiles (ICPs) for saralogy.com.
//
// The site has exactly two commercial visitors worth converting: someone who
// can HIRE Berk into a role, and someone who OWNS an SME and can BUY a
// consulting engagement. Everything else (music, travel, build logs) is
// audience-building that should ultimately route a qualified visitor into one
// of these two funnels.
//
// This file is the single source of truth for the self-serve intent router
// (IntentRouter.astro) and the /start funnel hub. Funnel copy is derived from
// these objects so messaging stays consistent and is edited in one place.

export type IcpId = "hiring" | "sme";

export interface Icp {
  /** Stable id, also used as the `intent` query param on funnel links. */
  id: IcpId;
  /** Short audience-facing label for the router card. */
  label: string;
  /** First-person self-identification line: "I'm a…" */
  selfId: string;
  /** One-line description of the moment this person is in. */
  situation: string;
  /** "This is you if" qualifiers — visitor self-segments against these. */
  qualifiers: string[];
  /** The open questions in their head, in priority order. */
  openQuestions: string[];
  /** The single proof point that earns the click for this ICP. */
  proof: { stat: string; context: string };
  /** Where the funnel sends them. */
  destination: string;
  /** Primary conversion action. */
  primaryCta: { label: string; href: string };
  /** Secondary, lower-commitment action. */
  secondaryCta: { label: string; href: string };
  /** What "converted" means for this ICP — the contact event we want. */
  conversionGoal: string;
}

/** Pre-filled mailto links so the inbound message is already qualified. */
const hiringMailto =
  "mailto:berksaraloglu@gmail.com?subject=Senior%20Marketing%20role%20via%20saralogy.com&body=Hi%20Berk%2C%0A%0AWe%20have%20an%20open%20role%20that%20might%20fit.%0A%0ACompany%3A%0ARole%2Flevel%3A%0ALocation%3A%0AWhy%20I%20thought%20of%20you%3A%0A";

const smeMailto =
  "mailto:berksaraloglu@gmail.com?subject=Consulting%20enquiry%20via%20saralogy.com&body=Hi%20Berk%2C%0A%0AWe%E2%80%99re%20a%20DACH%20company%20looking%20at%20AI%20marketing.%0A%0ACompany%3A%0ATeam%20size%3A%0AThe%20problem%20we%E2%80%99re%20trying%20to%20solve%3A%0ATimeline%3A%0A";

export const icps: Icp[] = [
  {
    id: "hiring",
    label: "You're hiring",
    selfId: "I'm hiring for a marketing role",
    situation:
      "You have an open Senior Marketing Manager seat in Hamburg or DACH and you need someone who can own brand, performance, and AI from day one.",
    qualifiers: [
      "Recruiter, talent partner, marketing director, or founder building a team",
      "Hiring in Hamburg or the wider DACH region (no relocation needed)",
      "Need a senior generalist who has run enterprise and launch-stage marketing",
      "Want someone who treats AI as infrastructure, not a content shortcut",
    ],
    openQuestions: [
      "Is he actually available, and when?",
      "What level and what salary band?",
      "What about his German, and the two short tenures?",
      "Can I see proof before I spend a call?",
    ],
    proof: {
      stat: "117% of sell-out target in 53 days",
      context:
        "Full-funnel launch at VeSync across 8 channels. 11+ years at Samsung, BSH Siemens, VeSync.",
    },
    destination: "/open-to-work",
    primaryCta: { label: "See if I fit your role", href: "/open-to-work" },
    secondaryCta: { label: "Email the role", href: hiringMailto },
    conversionGoal: "Role enquiry by email, CV download, or a 15-minute intro call.",
  },
  {
    id: "sme",
    label: "You run a company",
    selfId: "I run a company that needs AI marketing",
    situation:
      "You're a DACH SME using AI tools ad hoc with inconsistent output, or you have a product ready for the market and no structured way to launch it.",
    qualifiers: [
      "Founder, owner, or managing director of a DACH company (10–100 employees)",
      "A single marketer or a small team doing everything",
      "Paying for AI tools but getting inconsistent, disconnected output",
      "Have budget and a mandate to move beyond experimenting",
    ],
    openQuestions: [
      "What exactly do I get, and by when?",
      "What does it cost?",
      "Is this fixed-scope or an open-ended retainer?",
      "Has he done this at real scale before?",
    ],
    proof: {
      stat: "€1.5M annual content cost saved at BSH",
      context:
        "Systematic beats creative. Fixed-scope engagements from €3,000, first automation live in week one.",
    },
    destination: "/work",
    primaryCta: { label: "See how we'd work together", href: "/work" },
    secondaryCta: { label: "Book a discovery call", href: "https://cal.com/saralogy/15min" },
    conversionGoal: "Discovery call booked or a scoped consulting enquiry by email.",
  },
];

export const icpMailto: Record<IcpId, string> = {
  hiring: hiringMailto,
  sme: smeMailto,
};

export function getIcp(id: IcpId): Icp {
  const icp = icps.find((i) => i.id === id);
  if (!icp) throw new Error(`Unknown ICP: ${id}`);
  return icp;
}
