'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Aarav Mehta',
    location: 'Bandra, Mumbai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    burger: 'The OG Double Smash',
    comment:
      'Genuinely the best smash burger in India right now. The crispy lacy crust is unmatched, and the umami smash sauce is pure gold.',
  },
  {
    name: 'Pooja Hegde',
    location: 'Indiranagar, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    burger: 'Truffle Umami Melt',
    comment:
      'The black truffle butter with portobello mushrooms and melted gruyere is divine. Arrived piping hot with the packaging perfectly crisp.',
  },
  {
    name: 'Kabir Varma',
    location: 'CyberHub, Gurugram',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    burger: 'Nashville Hot Firebird',
    comment:
      'The crunch on this fried chicken is ridiculous. Fiery chili heat balanced by honey butter drizzle. Ordering again this weekend!',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-brand-dark-surface border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
            COMMUNITY & CRAVINGS
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-brand-cream uppercase tracking-tight">
            WHAT THE <span className="text-brand-red">CROWD SAYS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-brand-dark border border-white/10 flex flex-col justify-between hover:border-brand-yellow/30 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-brand-yellow">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-white/10" />
                </div>

                <p className="text-sm sm:text-base text-brand-cream/80 font-body leading-relaxed mb-6 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* User Bio */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-3.5">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-brand-red/50">
                  <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-cream uppercase">
                    {review.name}
                  </h4>
                  <span className="text-xs font-mono text-brand-cream/50">
                    {review.location} • <strong className="text-brand-yellow">{review.burger}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
