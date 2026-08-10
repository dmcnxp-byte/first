"use client";

import { useId, useState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { LeadFormConfig } from "@/lib/sanity/types/shared";

// The single, config-driven lead-form component in the codebase — DOC/FORMS_ARCHITECTURE.md § 1.
// Renders exactly `config.fields`, in the fixed visual order name -> phone ->
// email -> city -> select, and posts a payload shaped by whichever fields
// were actually rendered.
export function LeadForm({
  config,
  context,
}: {
  config: LeadFormConfig;
  context: { pageType: string; documentId?: string; slug?: string };
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const honeypotId = useId();

  function setValue(field: string, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const honeypot = String(formData.get("company_website") ?? "");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "form",
          fields: values,
          context,
          honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="border-hairline rounded-xl border bg-white p-8 shadow-[0_12px_28px_-16px_rgba(11,31,77,0.12)]"
        role="status"
      >
        <h3 className="font-display text-navy text-xl font-semibold">
          Thank you — we&apos;ve got it.
        </h3>
        <p className="text-slate mt-2">A counsellor will call you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-hairline flex flex-col gap-5 rounded-xl border bg-white p-8 shadow-[0_12px_28px_-16px_rgba(11,31,77,0.12)]"
    >
      <div>
        <h3 className="font-display text-navy text-xl font-semibold">{config.title}</h3>
        {config.subtitle ? (
          <p className="text-slate mt-1 text-sm">{config.subtitle}</p>
        ) : null}
      </div>

      {/* Honeypot — invisible to real users, excluded from config.fields, per DOC/FORMS_ARCHITECTURE.md § 7 */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={honeypotId}>Company website</label>
        <input
          id={honeypotId}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {config.fields.includes("name") ? (
        <Field label="Your name">
          <Input
            name="name"
            type="text"
            placeholder="e.g. Rahul Sharma"
            required
            value={values.name ?? ""}
            onChange={(e) => setValue("name", e.target.value)}
          />
        </Field>
      ) : null}

      {config.fields.includes("phone") ? (
        <Field label="Phone">
          <Input
            name="phone"
            type="tel"
            phonePrefix="+91"
            placeholder="86696 61005"
            required
            value={values.phone ?? ""}
            onChange={(e) => setValue("phone", e.target.value)}
          />
        </Field>
      ) : null}
      {errors.phone ? <p className="text-error -mt-3 text-sm">{errors.phone}</p> : null}

      {config.fields.includes("email") ? (
        <Field label="Email">
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={values.email ?? ""}
            onChange={(e) => setValue("email", e.target.value)}
          />
        </Field>
      ) : null}

      {config.fields.includes("city") ? (
        <Field label="City">
          <Input
            name="city"
            type="text"
            placeholder="e.g. Mumbai"
            value={values.city ?? ""}
            onChange={(e) => setValue("city", e.target.value)}
          />
        </Field>
      ) : null}

      {config.fields.includes("select") && config.selectOptions ? (
        <Field label={config.selectLabel ?? "Select"}>
          <Select
            name="select"
            options={config.selectOptions}
            value={values.select ?? config.selectOptions[0]}
            onChange={(e) => setValue("select", e.target.value)}
          />
        </Field>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        disabled={status === "submitting"}
        withArrow
      >
        {status === "submitting" ? "Submitting..." : config.submitLabel}
      </Button>

      {status === "error" ? (
        <p className="text-error text-sm" role="alert">
          Something went wrong — please check the fields above and try again.
        </p>
      ) : null}

      {config.footerNote ? (
        <p className="text-slate text-xs">{config.footerNote}</p>
      ) : null}
    </form>
  );
}
