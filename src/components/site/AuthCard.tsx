import type { ReactNode } from "react";
import { PageShell } from "@/components/site/Layout";
import { signInWithGoogle, authErrorFr } from "@/lib/auth";

export const authInput =
  "mt-1.5 h-11 w-full rounded border bg-card px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground";
export const authButton =
  "h-11 w-full rounded bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <PageShell>
      <div className="container-page flex justify-center py-16">
        <div className="w-full max-w-md rounded-xl border bg-card p-8">
          <h1 className="font-serif text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </PageShell>
  );
}

export function AuthField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="micro-label text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function GoogleButton({ onError }: { onError: (m: string) => void }) {
  return (
    <>
      <button
        type="button"
        onClick={async () => {
          const { error } = await signInWithGoogle();
          if (error) onError(authErrorFr(error.message));
        }}
        className="h-11 w-full rounded border bg-background text-sm font-medium hover:bg-muted"
      >
        Continuer avec Google
      </button>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
      </div>
    </>
  );
}

export function FormMessage({ error, info }: { error?: string | null; info?: string | null }) {
  if (error) return <p role="alert" className="text-sm text-destructive">{error}</p>;
  if (info) return <p role="status" className="text-sm text-foreground">{info}</p>;
  return null;
}
