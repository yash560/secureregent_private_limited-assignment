'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PeriodDateRange } from '@/types/dashboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodRange: PeriodDateRange;
  datasetSummary: any;
}

export function ExportModal({
  isOpen,
  onClose,
  periodRange,
  datasetSummary,
}: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // fallback
    }
  };

  const handleDownloadJSON = () => {
    triggerConfetti();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(datasetSummary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SecureRegent_Analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(datasetSummary, null, 2));
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Export Executive Analytics Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Period: {periodRange.currentLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Report Entity Scope:</span>
              <span className="font-semibold text-slate-900 dark:text-white">SecureRegent Private Limited</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Normalization Baseline:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{periodRange.previousLabel}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Total Dataset Records:</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {datasetSummary?.totalLeads} Leads, {datasetSummary?.totalQuotes} Quotes, {datasetSummary?.totalDeals} Deals
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export the normalized comparative analytics package including all domain KPIs, stage drop-offs, service-wise matrix breakdown, and transactional collection records.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard!' : 'Copy JSON'}
          </button>

          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/25"
          >
            <Download className="w-3.5 h-3.5" />
            Download Complete JSON
          </button>
        </div>

      </div>
    </div>
  );
}
