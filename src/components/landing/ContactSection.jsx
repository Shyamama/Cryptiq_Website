import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Check } from "lucide-react";

const ACCESS_KEY = "489c8d76-8ef0-4d27-9997-e15bb7c34923";

export default function ContactSection() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(event.target);
    formData.append("access_key", ACCESS_KEY);
    formData.append("subject", "New CryptiQ inquiry");
    formData.append("from_name", "CryptiQ website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus("success");
        event.target.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Couldn't reach the server. Check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="relative z-10 py-32 md:py-48">
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="font-mono text-[10px] tracking-widest text-foreground/60 mb-4">
            GET IN TOUCH
          </p>
          <h2 className="font-mono text-xl md:text-2xl font-light tracking-tight mb-4">
            Talk to us about
            <span className="text-foreground/70"> your migration.</span>
          </h2>
          <p className="font-body text-sm text-foreground/70 leading-relaxed mb-12 max-w-lg">
            We're taking on a small number of design partners. Tell us a bit
            about what you're working with, and we'll get back to you within
            a business day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          {status === "success" ? (
            <div className="flex items-start gap-3 border border-emerald-400/30 bg-emerald-400/5 rounded-md px-5 py-4">
              <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-mono text-xs text-emerald-400 tracking-wide">
                  MESSAGE SENT
                </p>
                <p className="font-body text-sm text-foreground/70 mt-1">
                  Thanks — we'll be in touch soon.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="font-mono text-[10px] tracking-widest text-foreground/50 mb-2 block"
                  >
                    NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Your Name"
                    className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="font-mono text-[10px] tracking-widest text-foreground/50 mb-2 block"
                  >
                    WORK EMAIL
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="font-mono text-[10px] tracking-widest text-foreground/50 mb-2 block"
                >
                  COMPANY
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Your Company"
                  className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-400/50 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="font-mono text-[10px] tracking-widest text-foreground/50 mb-2 block"
                >
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="What are you working with, and what's prompting the search?"
                  className="w-full bg-transparent border border-white/15 rounded-md px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-400/50 transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <p className="font-mono text-xs text-red-400">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-widest bg-foreground text-background px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-wait"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    SENDING
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}