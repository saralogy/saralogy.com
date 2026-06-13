import { defineCollection, z } from "astro:content";

const seoFields = z.object({
  title: z.string().max(60),
  description: z.string().min(120).max(160),
  ogImage: z.string().optional(),
  noIndex: z.boolean().default(false),
});

const contentStatus = z.enum(["draft", "published"]);

const careerCollection = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      company: z.string(),
      companyShort: z.string(),
      location: z.string(),
      period: z.object({
        start: z.string(),
        end: z.string().or(z.literal("present")),
      }),
      role: z.string(),
      roleHistory: z.array(z.object({ title: z.string(), period: z.string() })).optional(),
      wins: z.array(z.object({
        headline: z.string(),
        metric: z.string().optional(),
        context: z.string().optional(),
      })),
      skills: z.array(z.string()),
      tools: z.array(z.string()).optional(),
      departureContext: z.string(),
      currentRelevance: z.object({
        date: z.string(),
        body: z.string(),
      }),
      projectsFromHere: z.array(z.object({
        title: z.string(),
        url: z.string(),
        connection: z.string(),
      })).optional(),
      lastReviewed: z.string(),
      seo: seoFields,
      status: contentStatus.default("draft"),
      order: z.number().optional(),
    }),
});

const musicCollection = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      title: z.string(),
      byArtist: z.string().default("Berk Saraloglu"),
      duration: z.string().optional(),
      genre: z.array(z.string()),
      datePublished: z.string().optional(),
      isrc: z.string().optional(),
      spotify: z.string().url().optional(),
      appleMusic: z.string().url().optional(),
      youtube: z.string().url().optional(),
      soundcloud: z.string().url().optional(),
      releaseStatus: z.enum(["released", "demo", "writing", "archived"]),
      writingProcess: z.string().optional(),
      behindTheLyrics: z.string().optional(),
      productionNotes: z.string().optional(),
      influences: z.array(z.string()).optional(),
      seo: seoFields,
      status: contentStatus.default("draft"),
    }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      title: z.string(),
      tagline: z.string().max(100),
      projectStatus: z.enum(["concept", "mvp", "beta", "live", "archived"]),
      problem: z.string(),
      audience: z.string(),
      howItWorks: z.string(),
      techStack: z.array(z.string()).optional(),
      githubUrl: z.string().url().optional(),
      liveUrl: z.string().url().optional(),
      waitlistUrl: z.string().url().optional(),
      originStory: z.string().optional(),
      careerOrigin: z.string().optional(),
      seo: seoFields,
      status: contentStatus.default("draft"),
      featured: z.boolean().default(false),
      order: z.number().optional(),
    }),
});

const tripsCollection = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      title: z.string(),
      level: z.enum(["country", "city"]),
      parentSlug: z.string().optional(),
      visitedAt: z.string(),
      visitCount: z.number().default(1),
      highlight: z.string(),
      recommendation: z.string().optional(),
      seo: seoFields,
      status: contentStatus.default("draft"),
    }),
});

const writingCollection = defineCollection({
  type: "content",
  schema: () =>
    z.object({
      title: z.string(),
      publishedAt: z.string(),
      updatedAt: z.string().optional(),
      intersects: z.array(
        z.enum(["marketing", "music", "ai", "product", "career", "design", "culture"])
      ).min(2),
      excerpt: z.string().max(280),
      readingTime: z.number().optional(),
      seo: seoFields,
      status: contentStatus.default("draft"),
      featured: z.boolean().default(false),
    }),
});

export const collections = {
  career: careerCollection,
  music: musicCollection,
  projects: projectsCollection,
  trips: tripsCollection,
  writing: writingCollection,
};
