const footerLinks = {
  Work: ["Career", "Projects", "AI Marketing", "Music"],
  Connect: ["About", "Now", "FAQ", "Privacy"],
  Contact: ["berksaraloglu@gmail.com", "LinkedIn", "GitHub", "X / Twitter"],
};

const hrefMap: Record<string, string> = {
  "Career": "/career",
  "Projects": "/projects",
  "AI Marketing": "/ai-marketing-dach",
  "Music": "/music",
  "About": "/about",
  "Now": "/now",
  "FAQ": "/faq",
  "Privacy": "/privacy",
  "berksaraloglu@gmail.com": "mailto:berksaraloglu@gmail.com?subject=via%20saralogy.com",
  "LinkedIn": "https://linkedin.com/in/berksaraloglu",
  "GitHub": "https://github.com/berksaraloglu",
  "X / Twitter": "https://x.com/berksaraloglu",
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              Let's build
              <br />
              something
              <br />
              <span className="italic font-light">remarkable.</span>
            </p>
            <a
              href="mailto:berksaraloglu@gmail.com?subject=via%20saralogy.com"
              className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase border border-white/30 px-5 py-2.5 self-start hover:bg-white hover:text-black transition-all duration-200 mt-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Get in touch
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <p
                className="text-[10px] tracking-[0.2em] uppercase text-white/40"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {heading}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href={hrefMap[link] ?? "#"}
                      target={hrefMap[link]?.startsWith("http") ? "_blank" : undefined}
                      rel={hrefMap[link]?.startsWith("http") ? "noopener" : undefined}
                      className="text-[13px] text-white/60 hover:text-white transition-colors duration-150"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p
            className="text-[11px] text-white/30 tracking-wider"
            style={{ fontFamily: "var(--font-body)" }}
          >
            © 2026 Berk Saraloglu® — All rights reserved
          </p>
          <p
            className="text-[11px] text-white/30 tracking-wider"
            style={{ fontFamily: "var(--font-body)" }}
          >
            AI-native marketing leader · Hamburg, Germany · saralogy.com
          </p>
        </div>
      </div>
    </footer>
  );
}
