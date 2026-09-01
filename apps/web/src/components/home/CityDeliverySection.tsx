'use client';

import { useState } from 'react';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CityCard {
  city: string;
  neighborhood: string;
  address: string;
  phone: string;
  hours: string;
  tag: string;
}

const CITIES: CityCard[] = [
  {
    city: 'MUMBAI',
    neighborhood: 'Bandra West & Lower Parel',
    address: 'Linking Road, Bandra West, Mumbai, MH 400050',
    phone: '+91 98200 12345',
    hours: '11:00 AM – 02:00 AM (Late Night)',
    tag: 'FLAGSHIP KITCHEN',
  },
  {
    city: 'BENGALURU',
    neighborhood: 'Indiranagar & Koramangala',
    address: '100ft Road, Indiranagar, Bengaluru, KA 560038',
    phone: '+91 98450 67890',
    hours: '11:00 AM – 01:00 AM',
    tag: 'CRAFT HUB',
  },
  {
    city: 'DELHI NCR',
    neighborhood: 'CyberHub & GK 2',
    address: 'CyberHub, DLF Phase 2, Gurugram, HR 122002',
    phone: '+91 98110 54321',
    hours: '11:00 AM – 03:00 AM (Late Night)',
    tag: 'HIGH VOLUME',
  },
  {
    city: 'HYDERABAD',
    neighborhood: 'Jubilee Hills & Hitec City',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, TS 500033',
    phone: '+91 98660 98765',
    hours: '12:00 PM – 01:30 AM',
    tag: 'GRILL LAB',
  },
  {
    city: 'PUNE',
    neighborhood: 'Koregaon Park & Kalyani Nagar',
    address: 'North Main Road, Koregaon Park, Pune, MH 411001',
    phone: '+91 98230 45678',
    hours: '12:00 PM – 01:00 AM',
    tag: 'EXPRESS SECTOR',
  },
];

export default function CityDeliverySection() {
  const [selectedCity, setSelectedCity] = useState<CityCard>(CITIES[0]);

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs text-brand-yellow font-bold uppercase tracking-widest block mb-2">
              DELIVERY & TAKEAWAY
            </span>
            <h2 className="font-display font-black text-4xl sm:text-6xl text-brand-cream uppercase tracking-tight">
              QUALITY THAT <span className="text-brand-red">TRAVELS WITH YOU</span>
            </h2>
          </div>
          <p className="text-sm text-brand-cream/70 font-body max-w-md">
            Our custom insulated, vapor-vented packaging ensures your burger arrives with crisp lace edges intact and zero soggy buns.
          </p>
        </div>

        {/* City Selectors & Detailed Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* City list buttons */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {CITIES.map((city) => {
              const isSelected = selectedCity.city === city.city;
              return (
                <button
                  key={city.city}
                  onClick={() => setSelectedCity(city)}
                  className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-brand-dark-elevated border-brand-red text-brand-cream translate-x-2 shadow-brand-glow'
                      : 'bg-brand-dark-surface border-white/10 hover:border-white/20 text-brand-cream/70 hover:text-brand-cream'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${isSelected ? 'text-brand-red' : 'text-brand-cream/40'}`} />
                    <div>
                      <span className="font-display font-black text-xl tracking-tight block">
                        {city.city}
                      </span>
                      <span className="text-xs text-brand-cream/60 font-body">
                        {city.neighborhood}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-brand-yellow">
                    {city.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected City Highlight Card */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-brand-dark-elevated border border-white/15 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="font-display font-black text-3xl sm:text-4xl text-brand-cream uppercase tracking-tight">
                  {selectedCity.city}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  OPEN NOW • SMASHING HOT
                </span>
              </div>

              <div className="space-y-4 font-body text-sm sm:text-base text-brand-cream/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                  <span>{selectedCity.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                  <span>{selectedCity.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-cream/60 flex-shrink-0" />
                  <span className="font-mono">{selectedCity.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-mono text-xs text-brand-cream/60">
                Average Delivery Time: <strong>28-35 mins</strong>
              </span>
              <Link
                href="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-brand-cream font-display font-bold text-xs uppercase tracking-wider shadow-brand-glow transition-all"
              >
                <span>ORDER TO THIS CITY</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
