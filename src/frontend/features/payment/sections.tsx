import { useState } from "react";
import { Check, ChevronRight, Copy, Mail } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { COMPANY } from "@/frontend/content/company";
import { paymentAccounts } from "./content";

export function PaymentDetails() {
  const [selectedId, setSelectedId] = useState("us-ach");
  const [copied, setCopied] = useState("");
  const account = paymentAccounts.find((item) => item.id === selectedId) ?? paymentAccounts[0];
  const countries = [...new Map(paymentAccounts.map((item) => [item.country, item])).values()];
  const methods = paymentAccounts.filter((item) => item.country === account?.country);
  const complete = account?.id !== "sg";

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 2000);
    } catch { setCopied(""); }
  }

  if (!account) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="page-shell py-8 sm:py-10">
          <p className="royal-label">Payments</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">Bank Account Details</h1>
          <p className="mt-2 text-sm text-muted-foreground">Rishishwar Industry Private Limited</p>
        </div>
      </div>
      <div className="page-shell py-8 lg:grid lg:grid-cols-[255px_minmax(0,1fr)] lg:gap-12 lg:py-12">
        <aside aria-label="Bank location" className="min-w-0 lg:border-r lg:border-border lg:pr-5">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Select your bank location</h2>
          <div className="flex gap-2 overflow-x-auto pb-3 lg:grid lg:gap-0 lg:overflow-visible lg:pb-0">
            {countries.map((item) => (
              <Button key={item.country} type="button" variant="ghost" aria-pressed={account.country === item.country}
                onClick={() => setSelectedId(item.id)}
                className={`h-auto min-h-12 shrink-0 justify-start gap-3 px-3 py-2 text-left text-xs normal-case tracking-normal lg:w-full lg:rounded-none lg:border-b lg:border-border ${account.country === item.country ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                <span className="text-xl leading-none" aria-hidden="true">{item.flag}</span>
                <span className="min-w-0 lg:whitespace-normal">{item.country}</span>
                {account.country === item.country && <ChevronRight className="ml-auto hidden size-4 lg:block" aria-hidden="true" />}
              </Button>
            ))}
          </div>
        </aside>
        <div className="min-w-0 pt-6 lg:pt-0">
          <div className="flex min-w-0 items-start gap-3">
            <span className="text-2xl" aria-hidden="true">{account.flag}</span>
            <h2 className="text-2xl leading-snug sm:text-3xl">Account details for payers in {account.country}</h2>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-2" aria-label="Payment method">
            <span className="mr-2 text-sm font-medium text-muted-foreground">Payment method:</span>
            {methods.map((item) => <Button key={item.id} type="button" size="sm" variant={selectedId === item.id ? "default" : "outline"} aria-pressed={selectedId === item.id} onClick={() => setSelectedId(item.id)}>{item.method}</Button>)}
          </div>
          <div className="mt-7 grid min-w-0 border border-border bg-card md:grid-cols-[minmax(210px,0.85fr)_minmax(0,2fr)]">
            <div className="border-b border-border bg-secondary/30 p-5 md:border-b-0 md:border-r md:p-7">
              <p className="text-xs text-muted-foreground">Account holder name</p>
              <p className="mt-1 break-words font-display text-lg leading-snug">Rishishwar Industry Private Limited</p>
              <p className="mt-8 text-xs text-muted-foreground">Payment method</p>
              <p className="mt-1 font-display text-lg">{account.method}</p>
              <p className="mt-8 text-xs text-muted-foreground">Currency</p>
              <p className="mt-1 font-display text-lg">{account.currency} Only</p>
            </div>
            <div className="min-w-0 p-5 md:p-7">
              {complete ? (
                <>
                  <dl className="grid min-w-0 gap-x-8 gap-y-7 sm:grid-cols-2">
                    {account.fields.slice(1).map((field) => (
                      <div key={field.label} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{field.label}</dt>
                        <dd className="mt-1 flex min-w-0 items-start gap-1 text-sm leading-relaxed">
                          <span className="min-w-0 break-words">{field.value}</span>
                          <Button type="button" variant="ghost" size="icon" className="-mt-1 size-7 shrink-0 text-primary" aria-label={`Copy ${field.label}`} title={`Copy ${field.label}`} onClick={() => copy(field.value, field.label)}>{copied === field.label ? <Check /> : <Copy />}</Button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-9 flex justify-start sm:justify-end">
                    <Button type="button" onClick={() => copy(account.fields.map((field) => `${field.label}: ${field.value}`).concat(`Payment method: ${account.method}`, `Currency: ${account.currency}`).join("\n"), "all")}>
                      {copied === "all" ? <Check /> : <Copy />}{copied === "all" ? "Copied" : "Copy account details"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-48 flex-col items-start justify-center">
                  <p className="text-lg">SGD account details are not available yet.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Please email us before making a payment.</p>
                  <Button asChild variant="outline" className="mt-5"><a href={`mailto:${COMPANY.email}?subject=SGD%20payment%20details`}><Mail />Email sales</a></Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}