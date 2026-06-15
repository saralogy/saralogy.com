export const personSchemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://saralogy.com/#website",
      url: "https://saralogy.com",
      name: "Saralogy",
      description: "AI-native marketing for DACH SMEs by Berk Saraloglu",
      publisher: { "@id": "https://saralogy.com/#person" },
      inLanguage: "en",
    },
    {
      "@type": "Person",
      "@id": "https://saralogy.com/#person",
      name: "Berk Saraloglu",
      url: "https://saralogy.com",
      email: "mailto:berksaraloglu@gmail.com",
      jobTitle: "Senior Marketing Manager",
      description:
        "Turkish-German marketing leader and AI tool builder in Hamburg. 11+ years at Samsung, BSH Siemens, VeSync. Building AI-native marketing infrastructure for DACH SMEs.",
      image: "https://saralogy.com/og-default.png",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
      knowsLanguage: ["en", "tr", "fr", "de"],
      alumniOf: [
        { "@type": "EducationalOrganization", name: "Istanbul Bilgi University" },
        { "@type": "EducationalOrganization", name: "Middle East Technical University" },
      ],
      sameAs: [
        "https://www.linkedin.com/in/berksaraloglu",
        "https://github.com/berksaraloglu",
        "https://x.com/berksaraloglu",
      ],
    },
  ],
});
