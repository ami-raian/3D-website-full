"use client";

import { useActionState } from "react";
import { sendContact, type ContactField, type ContactState } from "@/app/actions";
import { BUDGETS, SERVICE_GROUPS, SERVICES, type ServiceGroup } from "@/lib/site";

const initial: ContactState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const v = state.values ?? {};
  const err = (f: ContactField) => state.errors?.[f];
  // ties a field to its error message for screen readers
  const a11y = (f: ContactField) =>
    err(f) ? { "aria-invalid": true as const, "aria-describedby": `${f}-error` } : {};
  const errorFor = (f: ContactField) =>
    err(f) ? (
      <span id={`${f}-error`} className="field-error">
        {err(f)}
      </span>
    ) : null;

  if (state.status === "success") {
    return (
      <div className="form form-done" role="status">
        <span className="done-mark" aria-hidden>
          ✓
        </span>
        <h3>Message sent</h3>
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    // after an action React resets the form to its default values, so failed submissions
    // pass their values back as defaults; the key remounts the fields with them
    <form key={JSON.stringify(v)} className="form" action={action}>
      <div className="form-row">
        <label className="field">
          <span>Name *</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={100} defaultValue={v.name} {...a11y("name")} />
          {errorFor("name")}
        </label>
        <label className="field">
          <span>Email *</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={v.email}
            {...a11y("email")}
          />
          {errorFor("email")}
        </label>
      </div>

      <label className="field">
        <span>Company</span>
        <input name="company" autoComplete="organization" maxLength={120} defaultValue={v.company} {...a11y("company")} />
        {errorFor("company")}
      </label>

      <div className="form-row">
        <label className="field">
          <span>Service</span>
          <select name="service" defaultValue={v.service ?? ""} {...a11y("service")}>
            <option value="">Not sure yet</option>
            {(Object.keys(SERVICE_GROUPS) as ServiceGroup[]).map((g) => (
              <optgroup key={g} label={SERVICE_GROUPS[g].label}>
                {SERVICES.filter((s) => s.group === g).map((s) => (
                  <option key={s.title}>{s.title}</option>
                ))}
              </optgroup>
            ))}
            <optgroup label="More services">
              {SERVICES.filter((s) => !s.group).map((s) => (
                <option key={s.title}>{s.title}</option>
              ))}
            </optgroup>
          </select>
          {errorFor("service")}
        </label>
        <label className="field">
          <span>Budget</span>
          <select name="budget" defaultValue={v.budget ?? ""} {...a11y("budget")}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          {errorFor("budget")}
        </label>
      </div>

      <label className="field">
        <span>Project details *</span>
        <textarea
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={5000}
          placeholder="What are you building, and where are you stuck?"
          defaultValue={v.message}
          {...a11y("message")}
        />
        {errorFor("message")}
      </label>

      {/* spam trap: hidden from people and screen readers, bots tend to fill it in */}
      <div className="hp" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-foot">
        <p className={`form-msg${state.status === "error" ? " is-error" : ""}`} aria-live="polite">
          {state.status === "error" ? state.message : "We reply within one business day."}
        </p>
        <button className="btn" type="submit" disabled={pending}>
          <span>{pending ? "Sending…" : "Send message"}</span>
          <b aria-hidden>→</b>
        </button>
      </div>
    </form>
  );
}
