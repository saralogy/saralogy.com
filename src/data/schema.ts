export const personSchemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://saralogy.com/#website",
      url: "https://saralogy.com",
      name: "saralogy.com",
      description: "AI-native marketing for DACH SMEs by Berk Saraloglu",
      publisher: { "@id": "https://saralogy.com/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://saralogy.com/#person",
      name: "Berk Saraloglu",
      url: "https://saralogy.com",
      jobTitle: "Marketing Leader & AI Tool Builder",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hamburg",
        addressCountry: "DE",
      },
    },
  ],
});
