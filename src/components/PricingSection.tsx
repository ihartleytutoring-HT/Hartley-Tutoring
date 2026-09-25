import React, { useEffect, useState } from 'react';
import { PackagePrice } from '../types';
import { getPackagePrice } from '../services/curriculumService';
import { Check, Shield, Clock, Zap, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onOpenSubscribe: (duration?: number) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenSubscribe }) => {
  const [pricing, setPricing] = useState<PackagePrice>({
    id: 'default',
    month1: 250,
    month3: 600,
    month6: 1000,
    month12: 1800,
  });

  useEffect(() => {
    async function fetchPricing() {
      try {
        const p = await getPackagePrice();
        setPricing(p);
      } catch (err) {
        console.warn('Could not load dynamic pricing, using defaults:', err);
      }
    }
    fetchPricing();
  }, []);

  const tiers = [
    {
      months: 1,
      name: '1 Month Kickstart',
      price: pricing.month1,
      badge: 'Flexible Monthly',
      popular: false,
      description: 'Ideal for tackling an upcoming term test or mastering a tough topic.',
      features: [
        'Full access to chosen Grade & Subject',
        'All topic video lessons & walkthroughs',
        'Downloadable summary notes & cheat-sheets',
        'Interactive quizzes with 100% pass verification',
        'Direct WhatsApp support from Imraan',
      ],
    },
    {
      months: 3,
      name: '3 Months Term Pass',
      price: pricing.month3,
      monthlyEquiv: Math.round(pricing.month3 / 3),
      badge: 'Most Popular',
      popular: true,
      description: 'Covers an entire school term including mid-year exam revision.',
      features: [
        'Full access to chosen Grade & Subject',
        'All topic video lessons & walkthroughs',
        'Downloadable summary notes & cheat-sheets',
        'Interactive quizzes with 100% pass verification',
        'Past exam paper breakdown recordings',
        'Priority WhatsApp homework assistance',
        'Save R150 compared to monthly',
      ],
    },
    {
      months: 6,
      name: '6 Months Semester',
      price: pricing.month6,
      monthlyEquiv: Math.round(pricing.month6 / 6),
      badge: 'Best Value for Exams',
      popular: false,
      description: 'Comprehensive preparation for June exams, Trials, and prelims.',
      features: [
        'Everything in 3 Months Pass',
        'Complete curriculum coverage',
        'Personalized progress tracking',
        'Exam mock papers with full video memorandums',
        'Priority 1-on-1 Q&A sessions',
        'Save R500 compared to monthly',
      ],
    },
    {
      months: 12,
      name: '12 Months Full Year',
      price: pricing.month12,
      monthlyEquiv: Math.round(pricing.month12 / 12),
      badge: 'Ultimate Matric Master',
      popular: false,
      description: 'Year-round mastery from Term 1 through the final National Senior Certificate.',
      features: [
        'Complete 365-day unlimited access',
        'Both Paper 1 & Paper 2 masterclasses',
        'All future curriculum updates included',
        'Matric Countdown intensive revision pack',
        'Direct mentor access to Imraan Hartley',
        'Maximum savings (Save R1,200/year)',
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span>Transparent South African Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple, Affordable Subscriptions
          </h2>

          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            Choose your grade, pick your subject, and start achieving marks you can be proud of.
            Instant online activation with secure South African payment options.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.months}
              className={`relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 ${
                tier.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/15 lg:-translate-y-2'
                  : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                {!tier.popular && (
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 text-[11px] font-semibold text-slate-300 mb-4 border border-slate-700/60">
                    {tier.badge}
                  </span>
                )}

                <h3 className="text-xl font-bold text-white mt-1">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{tier.description}</p>

                {/* Price Display */}
                <div className="mt-5 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">R {tier.price}</span>
                    <span className="text-xs font-semibold text-slate-400">
                      / {tier.months} {tier.months === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>
                  {tier.monthlyEquiv && (
                    <p className="text-[11px] text-amber-400 font-medium mt-1">
                      Equates to ~R {tier.monthlyEquiv} / month
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Included:</p>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => onOpenSubscribe(tier.months)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tier.popular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span>Select {tier.months} {tier.months === 1 ? 'Month' : 'Months'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Security & Guarantee Footer */}
        <div className="mt-14 max-w-2xl mx-auto rounded-2xl bg-slate-950/60 border border-slate-800/80 p-5 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-400 text-center sm:text-left">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secure SA Payment Gateways</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Instant Access Upon Payment</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Cancel Anytime</span>
          </div>
        </div>

      </div>
    </section>
  );
};
