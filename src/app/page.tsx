"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Save,
  RefreshCw,
  ChevronRight,
  Sliders,
  Layers,
  FileSpreadsheet,
} from "lucide-react";

export default function LandingPage() {
  // State for interactive pairwise evaluation demo
  const [evalMode, setEvalMode] = useState<"group" | "individual">("group");
  const [activeCriterion, setActiveCriterion] = useState<number>(0);
  const [selectedWinner, setSelectedWinner] = useState<"A" | "equal" | "B" | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [pairIndex, setPairIndex] = useState<number>(3);
  const totalPairs = 5;

  const groupCriteria = [
    { id: 1, name: "System Architecture", weight: "40%" },
    { id: 2, name: "Implementation Quality", weight: "40%" },
    { id: 3, name: "Presentation & Demo", weight: "20%" },
  ];

  const individualCriteria = [
    { id: 1, name: "Individual Code Contribution", weight: "50%" },
    { id: 2, name: "Team Collaboration & Communication", weight: "30%" },
    { id: 3, name: "Problem Solving & Agility", weight: "20%" },
  ];

  const criteria = evalMode === "group" ? groupCriteria : individualCriteria;

  const candidateA = evalMode === "group" 
    ? { name: "Group 01: Smart Campus IoT", members: 4, score: "88%", tag: "Project A" }
    : { name: "Student A (Anonymous)", role: "Frontend Lead", score: "Rolling 92%", tag: "Peer A" };

  const candidateB = evalMode === "group" 
    ? { name: "Group 04: AI Vision Nav", members: 4, score: "85%", tag: "Project B" }
    : { name: "Student B (Anonymous)", role: "Backend Developer", score: "Rolling 89%", tag: "Peer B" };

  const handleSelect = (choice: "A" | "equal" | "B") => {
    setSelectedWinner(choice);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const handleNext = () => {
    if (pairIndex < totalPairs) {
      setPairIndex(pairIndex + 1);
      setSelectedWinner(null);
      setIsSaved(false);
    } else {
      setPairIndex(1);
      setSelectedWinner(null);
      setIsSaved(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Service Name & Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white font-sans">
                  Pair<span className="text-indigo-400">Eval</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  CE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Pairwise University Evaluation System
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#overview" className="hover:text-white transition-colors">
              Overview
            </a>
            <a href="#feature-demo" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Pairwise Demo
            </a>
            <a href="#principles" className="hover:text-white transition-colors">
              Key Principles
            </a>
            <a href="#stack" className="hover:text-white transition-colors">
              Tech Stack
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section id="overview" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6 animate-pulse">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Fair, Bias-Reduced Academic Evaluation System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Fairer University Grading with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Pairwise Comparisons
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Replace subjective numerical scores with intuitive A vs B pairwise evaluations.
            Ensures unbiased peer assessment, guaranteed 5x evaluation coverage, and real-time rolling feedback.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#feature-demo"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>Explore Pairwise Feature</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#principles"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 font-semibold text-sm transition-all"
            >
              View System Principles
            </a>
          </div>
        </section>

        {/* Feature Placeholder Section (Pairwise Evaluation Feature Prototype) */}
        <section id="feature-demo" className="py-12 bg-slate-900/60 border-y border-slate-800/80 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> Main Feature Preview
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                Pairwise Comparison Engine
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
                Evaluators simply select the better entity per criterion without guessing exact scores.
              </p>
            </div>

            {/* Interactive Pairwise Tool Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4 sm:p-8 relative overflow-hidden">
              {/* Card Header & Mode Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                  <span
                    data-testid="pair-progress"
                    className="px-3 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold"
                  >
                    PAIR {pairIndex} / {totalPairs}
                  </span>
                  <div className="h-4 w-px bg-slate-800 hidden sm:block" />
                  <p className="text-xs text-slate-400">
                    Assignment: <span className="text-white font-medium">Software Engineering Project Lab #2</span>
                  </p>
                </div>

                {/* Evaluation Mode Switch */}
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      setEvalMode("group");
                      setSelectedWinner(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      evalMode === "group"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Group Evaluation
                  </button>
                  <button
                    onClick={() => {
                      setEvalMode("individual");
                      setSelectedWinner(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      evalMode === "individual"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Individual Peer
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 mb-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Pairwise Progress</span>
                  <span>{Math.round((pairIndex / totalPairs) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                    style={{ width: `${(pairIndex / totalPairs) * 100}%` }}
                  />
                </div>
              </div>

              {/* Criteria Selector Tabs */}
              <div className="mb-8">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Criterion to Compare:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {criteria.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveCriterion(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        activeCriterion === idx
                          ? "bg-indigo-950/40 border-indigo-500/60 text-white shadow-md shadow-indigo-950"
                          : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span>{item.name}</span>
                        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          wt: {item.weight}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Head-to-head performance match
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Head-to-Head Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center mb-8">
                {/* Candidate A Card */}
                <button
                  type="button"
                  data-testid="candidate-a-card"
                  onClick={() => handleSelect("A")}
                  aria-pressed={selectedWinner === "A"}
                  className={`md:col-span-5 p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedWinner === "A"
                      ? "bg-indigo-950/50 border-indigo-400 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-950"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {candidateA.tag}
                    </span>
                    {selectedWinner === "A" && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {candidateA.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {evalMode === "group" ? `${candidateA.members} Team Members` : candidateA.role}
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Criterion Score:</span>
                      <span className="font-semibold text-emerald-400">{candidateA.score}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      &quot;Demonstrated clear architecture with 5x coverage algorithm.&quot;
                    </p>
                  </div>
                </button>

                {/* VS Badge */}
                <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 shadow-md">
                    VS
                  </div>
                  <button
                    data-testid="tie-button"
                    onClick={() => handleSelect("equal")}
                    className={`mt-2 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      selectedWinner === "equal"
                        ? "bg-purple-950 border-purple-500 text-purple-200"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Tie / Equal
                  </button>
                </div>

                {/* Candidate B Card */}
                <button
                   type="button"
                  data-testid="candidate-b-card"
                  onClick={() => handleSelect("B")}
                  aria-pressed={selectedWinner === "B"}
                  className={`md:col-span-5 p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedWinner === "B"
                      ? "bg-purple-950/50 border-purple-400 ring-2 ring-purple-500/40 shadow-xl shadow-purple-950"
                      : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {candidateB.tag}
                    </span>
                    {selectedWinner === "B" && (
                      <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {candidateB.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    {evalMode === "group" ? `${candidateB.members} Team Members` : candidateB.role}
                  </p>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Criterion Score:</span>
                      <span className="font-semibold text-emerald-400">{candidateB.score}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      &quot;High modularity, comprehensive test suite and robust docs.&quot;
                    </p>
                  </div>
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {isSaved ? (
                    // <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span
                        role="status"
                        data-testid="success-msg"
                        className="flex items-center gap-1.5 text-emerald-400 font-medium"
                      >
                      <CheckCircle2 className="w-4 h-4" /> Draft Saved
                    </span>
                  ) : (
                    <span>Click on a candidate or &quot;Tie&quot; to make selection</span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    data-testid="save-draft-btn"
                    onClick={handleSave}
                    disabled={!selectedWinner}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Draft
                  </button>

                  <button
                    data-testid="next-pair-btn"
                    onClick={handleNext}
                    disabled={!selectedWinner}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all"
                  >
                    <span>Next Pair</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Principles & PRD Alignment Grid */}
        <section id="principles" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
              Core Architectural Guarantees
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Built specifically for academic rigor and unbiased grading standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                5x Minimum Coverage
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Every pair combination is randomly evaluated at least 5 times across evaluators to guarantee statistical convergence and score accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Double-Blind Anonymity
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Students evaluate peers and groups without knowing who evaluated them, safeguarding objectivity and preventing interpersonal bias.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Instructor Weighting & Rolling Scores
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Instructors configure evaluation weights per assignment while students track daily rolling progress transparently before final deadlines.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack Summary */}
        <section id="stack" className="py-12 bg-slate-900/30 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Team KoenControl — PairEval Stack
                </h3>
                <p className="text-xs text-slate-400">
                  Next.js 14 App Router • TypeScript • Tailwind CSS • NextAuth Google OAuth • PostgreSQL & Prisma
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> Vercel Hosted
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> CSV/Excel Exports
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">PairEval System</span>
            <span>— KMITL Academic Project</span>
          </div>
          <p>© 2026 Team KoenControl. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
