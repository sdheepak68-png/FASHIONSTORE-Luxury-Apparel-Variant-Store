import React, { useState } from 'react';
import { Shirt, ShieldCheck, Truck, RefreshCw, Sparkles, Heart, Check, Mail } from 'lucide-react';
import { TASK_INFO } from '../data/internshipInfo';

interface FooterProps {
  onOpenTaskInfo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTaskInfo }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-950 border-t border-stone-850 text-stone-300 mt-20">
      
      {/* Value Badges Banner */}
      <div className="border-b border-stone-850 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-stone-100 text-xs">Complimentary Delivery</p>
              <p className="text-[11px] text-stone-400">On all fashion orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-stone-100 text-xs">30-Day Hassle-Free Returns</p>
              <p className="text-[11px] text-stone-400">Simple size &amp; color exchanges</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-stone-100 text-xs">Variant Integrity Engine</p>
              <p className="text-[11px] text-stone-400">Real-time SKU &amp; inventory track</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-900/40 border border-stone-800/60">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-stone-100 text-xs">AI Fit &amp; Try-On Simulation</p>
              <p className="text-[11px] text-stone-400">Precision sizing recommendations</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Description */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-black shadow-lg">
              👗
            </div>
            <span className="text-xl font-bold font-serif tracking-tight text-stone-50">
              FASHION<span className="text-amber-400">STORE</span>
            </span>
          </div>

          <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
            A premium full-stack fashion e-commerce experience featuring advanced size &amp; color variant management, dynamic inventory tracking, multi-facet filtering, and AI sizing advisory.
          </p>

          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 inline-block text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">Internship Task:</span>
              <span className="font-mono text-stone-200">{TASK_INFO.taskId}</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Company: <span className="text-stone-300 font-semibold">{TASK_INFO.company}</span>
            </p>
          </div>
        </div>

        {/* Quick Links: Departments */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-100 font-serif">
            Collections
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li><span className="hover:text-amber-400 cursor-pointer">Women&apos;s Apparel</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Men&apos;s Tailoring</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Kids &amp; Youth</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Luxury Outerwear</span></li>
            <li><span className="hover:text-amber-400 cursor-pointer">Leather &amp; Footwear</span></li>
          </ul>
        </div>

        {/* Architecture & Evaluation */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-100 font-serif">
            Project Specs
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>
              <button onClick={onOpenTaskInfo} className="text-amber-400 hover:underline cursor-pointer">
                Task JV-EC-004 Criteria
              </button>
            </li>
            <li><span className="hover:text-stone-200">Spring Boot Architecture</span></li>
            <li><span className="hover:text-stone-200">Hibernate JPA Relational Entities</span></li>
            <li><span className="hover:text-stone-200">MySQL Variant Schema (DDL)</span></li>
            <li><span className="hover:text-stone-200">Thymeleaf MVC Patterns</span></li>
          </ul>
        </div>

        {/* VIP Newsletter Form */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-100 font-serif">
            VIP Style Bulletin
          </h4>
          <p className="text-xs text-stone-400">
            Subscribe for exclusive seasonal drops and private promo codes.
          </p>

          <form onSubmit={handleNewsletter} className="space-y-2">
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-stone-900 border border-stone-800 text-stone-100 text-xs rounded-xl pl-8 pr-3 py-2 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Subscribe
            </button>
            {subscribed && (
              <p className="text-emerald-400 text-[11px] font-semibold text-center">
                ✓ You&apos;re on the VIP list! Coupon <span className="font-mono">FASHION10</span> unlocked.
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-850 py-6 px-4 text-center text-xs text-stone-500 flex flex-wrap items-center justify-between max-w-7xl mx-auto">
        <p>© 2026 FashionStore · Free Java Full Stack Internship Task JV-EC-004 · Data Alcott Systems</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Crafted with modern React, Spring Boot data model simulation &amp; Tailwind CSS
        </p>
      </div>

    </footer>
  );
};
