type GalleryItem = {
  title: string;
  subtitle: string;
  src: string;
};

const items: GalleryItem[] = [
  {
    title: "Hands‑on labs",
    subtitle: "Practice with real scenarios",
    src: "/colleges/b5af6ee0-ed4d-11eb-a043-f8aaa01a1d1e_1627242083337_1627556687642.webp",
  },
  {
    title: "Modern classrooms",
    subtitle: "A premium learning vibe",
    src: "/colleges/du-650_060114055506_0.jpeg",
  },
  {
    title: "Top institutions",
    subtitle: "Curated and verified",
    src: "/colleges/1.1-Top-10-Best-Colleges-in-India_-A-Comprehensive-Guide-to-Premier-Educational-Institutions-Source-home.iitd_.ac_.in_.jpg",
  },
  {
    title: "Clean design",
    subtitle: "Polished UX that feels elite",
    src: "/hero/college-1.svg",
  },
  {
    title: "Cohort energy",
    subtitle: "Community, sprints, feedback",
    src: "/hero/college-2.svg",
  },
  {
    title: "Career outcomes",
    subtitle: "Portfolio + confidence",
    src: "/hero/college-3.svg",
  },
];

export function GallerySection() {
  return (
    <section className="bg-white py-16 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Gallery
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            A clean, premium grid with subtle overlays and smooth hover motion.
          </p>
        </div>

        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((g) => (
            <div
              key={g.title}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-slate-900/5 bg-slate-50 shadow-md transition-all duration-300 ease-out hover:shadow-xl dark:border-white/10 dark:bg-slate-950"
            >
              <img
                src={g.src}
                alt=""
                className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />

              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent dark:from-slate-950/70" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-sm font-semibold text-white">{g.title}</div>
                  <div className="mt-1 text-xs text-white/80">{g.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
