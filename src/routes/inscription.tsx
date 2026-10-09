import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, AuthField, FormMessage, GoogleButton, authButton, authInput } from "@/components/site/AuthCard";
import { authErrorFr } from "@/lib/auth";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Créer un compte — So Pure" },
      { name: "description", content: "Créez votre compte So Pure et suivez l'historique de vos commandes." },
      { property: "og:title", content: "Créer un compte — So Pure" },
      { property: "og:description", content: "Rejoignez So Pure." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (sentTo)
    return (
      <AuthCard title="Vérifiez votre e-mail">
        <p className="text-sm">
          Un lien de confirmation a été envoyé à <strong>{sentTo}</strong>. Cliquez dessus pour activer votre compte, puis connectez-vous.
        </p>
        <Link to="/login" className={`${authButton} mt-6 flex items-center justify-center`}>Aller à la connexion</Link>
      </AuthCard>
    );

  return (
    <AuthCard title="Créer un compte" subtitle="Suivez vos commandes et commandez plus vite.">
      <GoogleButton onError={setError} />
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get("email"));
          setBusy(true);
          setError(null);
          const { error } = await supabase.auth.signUp({
            email,
            password: String(fd.get("password")),
            options: {
              emailRedirectTo: `${window.location.origin}/compte`,
              data: { first_name: String(fd.get("first_name")).trim(), last_name: String(fd.get("last_name")).trim() },
            },
          });
          setBusy(false);
          if (error) return setError(authErrorFr(error.message));
          setSentTo(email);
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <AuthField label="Prénom"><input name="first_name" required autoComplete="given-name" className={authInput} /></AuthField>
          <AuthField label="Nom"><input name="last_name" required autoComplete="family-name" className={authInput} /></AuthField>
        </div>
        <AuthField label="E-mail"><input name="email" type="email" required autoComplete="email" className={authInput} /></AuthField>
        <AuthField label="Mot de passe (6 caractères min.)"><input name="password" type="password" minLength={6} required autoComplete="new-password" className={authInput} /></AuthField>
        <FormMessage error={error} />
        <button disabled={busy} className={authButton}>{busy ? "Création…" : "Créer mon compte"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà un compte ? <Link to="/login" className="font-medium text-foreground underline underline-offset-2">Se connecter</Link>
      </p>
    </AuthCard>
  );
}
