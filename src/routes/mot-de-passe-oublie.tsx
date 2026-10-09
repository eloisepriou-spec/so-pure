import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, AuthField, FormMessage, authButton, authInput } from "@/components/site/AuthCard";
import { authErrorFr } from "@/lib/auth";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — So Pure" },
      { name: "description", content: "Recevez un lien pour réinitialiser votre mot de passe So Pure." },
      { property: "og:title", content: "Mot de passe oublié — So Pure" },
      { property: "og:description", content: "Réinitialisez votre mot de passe So Pure." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <AuthCard title="Mot de passe oublié" subtitle="Nous vous envoyons un lien pour en choisir un nouveau.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const email = String(new FormData(e.currentTarget).get("email"));
          setBusy(true);
          setError(null);
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          setBusy(false);
          if (error) return setError(authErrorFr(error.message));
          setInfo(`Si un compte existe pour ${email}, un lien vient d'être envoyé.`);
        }}
      >
        <AuthField label="E-mail"><input name="email" type="email" required autoComplete="email" className={authInput} /></AuthField>
        <FormMessage error={error} info={info} />
        <button disabled={busy} className={authButton}>{busy ? "Envoi…" : "Envoyer le lien"}</button>
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="underline underline-offset-2">Retour à la connexion</Link></p>
    </AuthCard>
  );
}
