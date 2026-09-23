"use client";

import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";

const MAX_MESSAGE = 1000;
const MAX_SUBJECT = 200;

type FieldKey = "name" | "email" | "message";

const VALIDATORS: Record<FieldKey, (value: string) => string | null> = {
  name: (value) => (value.trim().length >= 2 ? null : "Please enter your name."),
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
      ? null
      : "Please enter a valid email address.",
  message: (value) =>
    value.trim().length >= 10 ? null : "Please write at least 10 characters.",
};

type Field = HTMLInputElement | HTMLTextAreaElement;

const FIELD_CLASS =
  "w-full rounded-md border border-edge bg-ink px-4 py-[14px] text-cream caret-amber outline-none transition-colors duration-150 placeholder:text-[rgba(184,168,152,0.55)] hover:border-[rgba(255,107,0,0.45)] focus:border-amber focus:bg-[#101518] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.12)] aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[0_0_0_3px_rgba(204,34,0,0.12)]";

export default function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const validate = (key: FieldKey, value: string): boolean => {
    const error = VALIDATORS[key](value);
    setErrors((prev) => ({ ...prev, [key]: error ?? undefined }));
    return error === null;
  };

  const handleBlur = (key: FieldKey) => (event: FocusEvent<Field>) => {
    validate(key, event.currentTarget.value);
  };

  const handleChange = (key: FieldKey) => (event: ChangeEvent<Field>) => {
    const { value } = event.currentTarget;
    if (key === "message") setMessage(value);
    if (errors[key]) validate(key, value);
    setStatus(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    let firstInvalid: FieldKey | null = null;
    const nextErrors: Partial<Record<FieldKey, string>> = {};
    (Object.keys(VALIDATORS) as FieldKey[]).forEach((key) => {
      const error = VALIDATORS[key](values[key]);
      if (error) {
        nextErrors[key] = error;
        firstInvalid ??= key;
      }
    });
    setErrors(nextErrors);

    if (firstInvalid) {
      setStatus({ type: "error", message: "error: please fix the highlighted fields." });
      form.querySelector<Field>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Request failed");

      setStatus({
        type: "success",
        message: "success: message transmitted. I'll get back to you soon.",
      });
      form.reset();
      setMessage("");
    } catch {
      setStatus({
        type: "error",
        message: "error: transmission failed. Please try again or email me directly.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="p-8 max-[640px]:px-5 max-[640px]:py-6" noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 min-[560px]:grid-cols-2">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-[9px] flex items-center gap-2 font-mono text-xs font-medium text-terminal"
          >
            <span className="text-amber">&gt;</span> name
            <span className="ml-auto text-amber">required</span>
          </label>
          <input
            className={FIELD_CLASS}
            type="text"
            id="name"
            name="name"
            placeholder="Your full name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            onBlur={handleBlur("name")}
            onChange={handleChange("name")}
          />
          <div className="mt-[7px] flex min-h-[20px] justify-between gap-4 font-mono text-[11px]">
            <span className="text-[#FF745C]">{errors.name ?? ""}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-[9px] flex items-center gap-2 font-mono text-xs font-medium text-terminal"
          >
            <span className="text-amber">&gt;</span> email
            <span className="ml-auto text-amber">required</span>
          </label>
          <input
            className={FIELD_CLASS}
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            onBlur={handleBlur("email")}
            onChange={handleChange("email")}
          />
          <div className="mt-[7px] flex min-h-[20px] justify-between gap-4 font-mono text-[11px]">
            <span className="text-[#FF745C]">{errors.email ?? ""}</span>
          </div>
        </div>

        <div className="flex flex-col min-[560px]:col-span-2">
          <label
            htmlFor="subject"
            className="mb-[9px] flex items-center gap-2 font-mono text-xs font-medium text-terminal"
          >
            <span className="text-amber">&gt;</span> subject
            <span className="ml-auto text-muted">optional</span>
          </label>
          <input
            className={FIELD_CLASS}
            type="text"
            id="subject"
            name="subject"
            placeholder="What's this about?"
            maxLength={MAX_SUBJECT}
            aria-invalid={false}
          />
          <div className="mt-[7px] flex min-h-[20px] justify-between gap-4 font-mono text-[11px]" />
        </div>

        <div className="flex flex-col min-[560px]:col-span-2">
          <label
            htmlFor="message"
            className="mb-[9px] flex items-center gap-2 font-mono text-xs font-medium text-terminal"
          >
            <span className="text-amber">&gt;</span> message
            <span className="ml-auto text-amber">required</span>
          </label>
          <textarea
            className={`${FIELD_CLASS} min-h-[190px] resize-y leading-[1.7]`}
            id="message"
            name="message"
            placeholder="Tell me about your project, the problem you’re solving, and what you need built..."
            maxLength={MAX_MESSAGE}
            required
            value={message}
            aria-invalid={Boolean(errors.message)}
            onBlur={handleBlur("message")}
            onChange={handleChange("message")}
          />
          <div className="mt-[7px] flex min-h-[20px] justify-between gap-4 font-mono text-[11px]">
            <span className="text-[#FF745C]">{errors.message ?? ""}</span>
            <span className="ml-auto text-muted">
              {message.length} / {MAX_MESSAGE}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-[26px] flex flex-wrap items-center justify-between gap-5 border-t border-edge pt-6 max-[639px]:flex-col max-[639px]:items-stretch">
        <p className="max-w-[380px] text-[13px] leading-[1.6] text-muted max-[639px]:max-w-none">
          <strong className="font-semibold text-cream">Direct to my inbox.</strong>{" "}
          Your message is stored securely and I reply within 24 hours.
        </p>
        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary min-w-[178px] max-[639px]:w-full disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending ? "Sending…" : "Send Message →"}
        </button>
      </div>

      {status ? (
        <div
          role="status"
          aria-live="polite"
          className={`mt-[18px] rounded-md border px-[15px] py-[13px] font-mono text-xs ${
            status.type === "success"
              ? "border-[rgba(0,255,65,0.28)] bg-[rgba(0,255,65,0.07)] text-terminal"
              : "border-[rgba(204,34,0,0.35)] bg-[rgba(204,34,0,0.08)] text-[#FF745C]"
          }`}
        >
          {status.message}
        </div>
      ) : null}
    </form>
  );
}