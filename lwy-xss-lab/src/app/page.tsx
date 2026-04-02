"use client";

import { useState, useEffect } from "react";
import { Bitcoin, ShieldAlert, Send, Flame, Infinity, ShieldCheck, ChevronRight, User } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

type Testimonial = {
  id: number;
  name: string;
  message: string;
  timestamp: string;
};

export default function ScamDoubler() {
  const [feedbacks, setFeedbacks] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [solved, setSolved] = useState(false);

  const { width, height } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // VULNERABILITY PREP: Overriding window.alert to capture XSS execution!
    const originalAlert = window.alert;

    window.alert = function () {
      setSolved(true);
    };

    fetchFeedbacks();

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  // FORCE SCRIPT EXECUTION FOR LAB
  // HTML5 blocks <script> tags injected via innerHTML. 
  // We manually evaluate them so user payloads like <script>alert(1)</script> work.
  useEffect(() => {
    feedbacks.forEach(f => {
      const scriptMatch = f.message.match(/<script>(.*?)<\/script>/i);
      if (scriptMatch && scriptMatch[1]) {
        try {
          // If the payload has a missing parenthesis like user's alert(3 , we auto-fix it for them to trigger it easily
          let code = scriptMatch[1];
          if (code.includes("alert(") && !code.includes(")")) {
            code = code + ")";
          }
          eval(code);
        } catch (e) { }
      }
    });
  }, [feedbacks]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback");
      const data = await res.json();
      setFeedbacks(data.feedbacks);
    } catch (e) {
      console.error("Failed to fetch");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setLoading(true);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message })
      });
      setName("");
      setMessage("");
      await fetchFeedbacks();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#070707] text-white font-sans flex flex-col justify-between overflow-x-hidden relative">
      {solved && mounted && <div className="fixed inset-0 pointer-events-none z-[100]"><Confetti width={width} height={height} numberOfPieces={600} recycle={false} /></div>}

      {/* Solved Modal Overlay */}
      {solved && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-yellow-500 rounded-3xl p-8 w-full max-w-lg text-center shadow-[0_0_80px_rgba(234,179,8,0.4)] animate-in zoom-in duration-500 mt-20 relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-neutral-900 border-2 border-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
              <Flame className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-yellow-500 pt-6">XSS Triggered!</h2>
            <p className="text-lg text-neutral-300 mb-6">
              You successfully injected an XSS payload bypassing the fake scam testimony board!
            </p>
            <div className="bg-black border border-yellow-500/30 font-mono text-xl font-bold rounded-xl py-4 px-6 mb-6 shadow-inner text-yellow-500 break-all">
              LWY{`{X55_SC4M_BU5T3R}`}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-12 rounded-full transition-colors w-full"
            >
              Reset Lab
            </button>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div>
        {/* Scam Header / Hero */}
        <div className="bg-gradient-to-b from-yellow-600/20 to-[#070707] border-b border-yellow-500/10 pt-12 pb-20 px-6 text-center relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full" />

          <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
            {/* Lab Hint Banner */}
            <div className="mb-10 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full inline-flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-300">Hint: make website to get popup to solve lab</span>
            </div>

            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl shadow-yellow-500/30 mb-6">
              <Bitcoin className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Double Your Crypto <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">in 24 Hours.</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mb-10">
              Join the world's leading high-yield autonomous trading protocol. Send your investment to our smart contract and receive exactly 200% back within a day.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded-xl px-6 py-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="font-bold">100% Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded-xl px-6 py-3">
                <Infinity className="w-5 h-5 text-blue-500" />
                <span className="font-bold">No Limits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fake Live Transactions */}
        <div className="bg-neutral-900 border-y border-white/5 py-4 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-neutral-900 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-neutral-900 to-transparent z-10" />
          <div className="flex w-max animate-[marquee_12s_linear_infinite] px-4">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex items-center gap-4 mx-8 shrink-0">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-neutral-400 font-mono text-sm">0x{(Math.random() * 100000000).toString(16)}...</span>
                <span className="text-neutral-500">just received</span>
                <span className="text-green-400 font-bold">+{Math.floor(Math.random() * 50) + 1} BTC</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials & Exploitation Area */}
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Submission Form */}
          <div className="bg-[#111] p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden h-fit">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-500/10 blur-[50px] rounded-full pointer-events-none" />

            <h2 className="text-3xl font-black mb-2 relative z-10">Write a Testimonial</h2>
            <p className="text-neutral-400 mb-8 text-sm relative z-10">Share your wealth generation experience with the community!</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div>
                <label className="text-sm font-bold text-neutral-300 mb-2 block uppercase tracking-wider">Your Alias</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium placeholder:text-neutral-700"
                  placeholder="e.g. Satoshi"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-neutral-300 mb-2 block uppercase tracking-wider">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all min-h-[160px] resize-none placeholder:text-neutral-700"
                  placeholder="I just got my 200% payout! The UI is slick..."
                  required
                />
              </div>
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              >
                {loading ? "Publishing..." : "Publish Testimonial"} <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Testimonial Board */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
              Live Reviews <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm">{feedbacks.length}</span>
            </h2>

            <div className="flex flex-col gap-5">
              {feedbacks.length === 0 ? (
                <div className="p-10 text-center text-neutral-500 border border-dashed border-white/10 rounded-2xl">
                  No reviews yet. Claim your payouts!
                </div>
              ) : (
                feedbacks.map((f) => (
                  <div key={f.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 transition-all hover:bg-[#161616] group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-800 rounded-full border border-white/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-tight">{f.name}</p>
                          <p className="text-xs text-neutral-500">{new Date(f.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 text-yellow-500 text-lg">
                        ★★★★★
                      </div>
                    </div>

                    {/* --- XSS VULNERABILITY HERE --- */}
                    <div
                      className="text-neutral-300 leading-relaxed text-sm break-words overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: f.message }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Basic Footer */}
      <footer className="border-t border-white/10 bg-black py-10 mt-auto w-full z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-neutral-500 text-sm font-medium text-center md:text-left leading-relaxed">
            © 2026 CryptoDoubler. <br />
            <span className="text-red-500 mt-1 block">Disclaimer: This is a simulated CTF Laboratory. Not a real cryptocurrency platform.</span>
          </p>

          <div className="flex items-center gap-3 text-sm font-medium px-5 py-2.5 bg-[#111] rounded-full border border-white/10">
            <span className="text-neutral-400">Developed by <strong className="text-white">Yuvi</strong></span>
            <span className="text-neutral-600">•</span>
            <a
              href="https://www.linkedin.com/in/researcher-yuvi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-400 transition-colors font-bold"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
