import React from 'react';
import { X, CheckCircle2, Award, FileText, Database, Code2, Globe, Sparkles } from 'lucide-react';
import { TASK_INFO, MYSQL_SCHEMA_SQL } from '../data/internshipInfo';

interface TaskInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskInfoModal: React.FC<TaskInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-stone-100 p-6 sm:p-8 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-stone-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 text-xl font-bold">
            👗
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/40">
                {TASK_INFO.taskId}
              </span>
              <span className="text-stone-400 text-xs font-medium">{TASK_INFO.company}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-50 mt-0.5">
              {TASK_INFO.taskName} · Internship Task Documentation
            </h2>
          </div>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
            <div>
              <p className="text-stone-500 font-medium">Domain</p>
              <p className="font-semibold text-stone-200 mt-0.5">{TASK_INFO.domain}</p>
            </div>
            <div>
              <p className="text-stone-500 font-medium">Industry</p>
              <p className="font-semibold text-stone-200 mt-0.5">{TASK_INFO.industry}</p>
            </div>
            <div>
              <p className="text-stone-500 font-medium">Core Stack</p>
              <p className="font-semibold text-amber-400 mt-0.5">{TASK_INFO.techStack}</p>
            </div>
            <div>
              <p className="text-stone-500 font-medium">Special Feature</p>
              <p className="font-semibold text-emerald-400 mt-0.5">{TASK_INFO.specialFeature}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800 space-y-2">
            <h3 className="font-bold font-serif text-sm text-stone-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Project Objective &amp; Requirements
            </h3>
            <p className="text-stone-300 leading-relaxed">
              {TASK_INFO.description}
            </p>
          </div>

          {/* Implemented Features Checklist */}
          <div className="space-y-3">
            <h3 className="font-bold font-serif text-sm text-stone-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Completed Key Deliverables
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TASK_INFO.deliverables.map((item, idx) => (
                <div key={idx} className="bg-stone-950 p-3 rounded-xl border border-stone-850 flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <span className="text-stone-300 text-[11px]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
            <h4 className="font-bold text-stone-200 text-xs uppercase tracking-wider">
              Grading &amp; Evaluation Focus
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-stone-400">
              <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-amber-400 font-bold block mb-1">Variant Integrity (40%)</span>
                Proper variant representation where colors and sizes hold distinct SKU, stock count, and price overrides.
              </div>
              <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-emerald-400 font-bold block mb-1">Filtering &amp; UX (30%)</span>
                Multi-faceted query filtering, responsive instant search, and stock-aware purchasing.
              </div>
              <div className="p-2.5 bg-stone-900 rounded-xl border border-stone-800">
                <span className="text-sky-400 font-bold block mb-1">Full-Stack Flow (30%)</span>
                Cart, promo codes, multi-step checkout, stock depletion, order fulfillment, and admin inventory tools.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            Data Alcott Systems · Free Java Full Stack Internship
          </span>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
          >
            Close &amp; Explore Store
          </button>
        </div>

      </div>
    </div>
  );
};
