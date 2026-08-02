import Link from "next/link";

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative bg-ink border-t border-white/10 overflow-hidden"
    >
      {/* Colossal wordmark */}
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 pt-24 pb-10 overflow-hidden">
        <h2
          aria-hidden="true"
          className="font-serif font-light text-white/[0.05] leading-[0.85] tracking-tighter uppercase select-none whitespace-nowrap text-[24vw] lg:text-[18vw]"
        >
          Cinéprism
        </h2>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-t border-white/10 pt-12">
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
              — The Cinéprism
            </p>
            <p className="font-serif italic text-zinc-300 text-lg leading-relaxed max-w-md">
              &ldquo;Cinema is a matter of what&rsquo;s in the frame and what&rsquo;s out.&rdquo;
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              — Martin Scorsese
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">
              Sections
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              <li><Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link href="/top-picks" className="hover:text-white transition-colors">Top Picks</Link></li>
              <li><Link href="/genres" className="hover:text-white transition-colors">Genres</Link></li>
              <li><Link href="/trending" className="hover:text-white transition-colors">Trending</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">Articles</Link></li>
              <li><Link href="/newsletter" className="hover:text-white transition-colors">Weekly</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">
              Elsewhere
            </p>
            <ul className="space-y-3 font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              <li>
                <a
                  href="https://x.com/TheCineprism"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-x-link"
                  className="hover:text-white transition-colors"
                >
                  X · @TheCineprism ↗
                </a>
              </li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          <p>© {new Date().getFullYear()} The Cinéprism — All frames reserved.</p>
          <p>Aspect Ratio 2.35 : 1 · Shot on 35mm memory.</p>
        </div>
      </div>
    </footer>
  );
}
