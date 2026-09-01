'use client';

export const dynamic = 'force-dynamic';

import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

const LOCATIONS = [
  {
    city: 'Mumbai',
    area: 'Bandra West (Flagship)',
    address: 'Linking Road, Bandra West, Mumbai, MH 400050',
    phone: '+91 98200 12345',
    hours: '11:00 AM – 02:00 AM (Daily)',
  },
  {
    city: 'Bengaluru',
    area: 'Indiranagar',
    address: '100ft Road, Indiranagar, Bengaluru, KA 560038',
    phone: '+91 98450 67890',
    hours: '11:00 AM – 01:00 AM (Daily)',
  },
  {
    city: 'Delhi NCR',
    area: 'Gurugram CyberHub',
    address: 'CyberHub, DLF Phase 2, Gurugram, HR 122002',
    phone: '+91 98110 54321',
    hours: '11:00 AM – 03:00 AM (Daily)',
  },
  {
    city: 'Hyderabad',
    area: 'Jubilee Hills',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, TS 500033',
    phone: '+91 98660 98765',
    hours: '12:00 PM – 01:30 AM (Daily)',
  },
  {
    city: 'Pune',
    area: 'Koregaon Park',
    address: 'North Main Road, Koregaon Park, Pune, MH 411001',
    phone: '+91 98230 45678',
    hours: '12:00 PM – 01:00 AM (Daily)',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
            REACH THE TEST KITCHEN
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl text-brand-cream uppercase tracking-tight leading-none mb-4">
            LOCATIONS & <span className="text-brand-red">CONTACT</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-cream/70 font-body">
            Have questions regarding catering, secret pop-ups, or delivery zones? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Kitchen Hubs List */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display font-black text-2xl text-brand-cream uppercase tracking-tight mb-6">
              CENTRAL KITCHEN HUBS
            </h2>
            <div className="space-y-4">
              {LOCATIONS.map((loc, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-brand-dark-surface border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-xl text-brand-cream">
                      {loc.city} — {loc.area}
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      LIVE & SMASHING
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-body text-brand-cream/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-red flex-shrink-0" />
                      <span>{loc.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                      <span className="font-mono">{loc.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-cream/50 flex-shrink-0" />
                      <span>{loc.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-brand-dark-surface border border-white/15 shadow-2xl">
            <h3 className="font-display font-black text-2xl text-brand-cream uppercase tracking-tight mb-2">
              SEND A MESSAGE
            </h3>
            <p className="text-xs text-brand-cream/60 font-body mb-6">
              Direct line to our customer experience & culinary team.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center space-y-2 font-mono">
                <p className="font-bold text-sm">Message Transmitted!</p>
                <p className="text-xs text-emerald-300">We will respond within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Iyer"
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. maya@example.com"
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-brand-cream/70 uppercase mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-cream placeholder-brand-cream/30 focus:outline-none focus:border-brand-red resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-xs uppercase tracking-wider shadow-brand-glow transition-all"
                >
                  <span>TRANSMIT MESSAGE</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
