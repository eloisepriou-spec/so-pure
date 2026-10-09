import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, AuthField, FormMessage, GoogleButton, authButton, authInput } from "@/components/site/AuthCard";
import { authErrorFr } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — So Pure" },
      { name: "description", content: "Connectez-vous à votre compte So Pure pour suivre vos commandes." },
      { property: "og:title", content: "Connexion — So Pure" },
      { property: "og:description", content: "Accédez à votre compte So Pure." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <AuthCard title="Connexion" subtitle="Retrouvez vos commandes et vos informations.">
      <GoogleButton onError={setError} />
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          setBusy(true);
          setError(null);
          const { error } = await supabase.auth.signInWithPassword({
            email: String(fd.get("email")),
            password: String(fd.get("password")),
          });
          setBusy(false);
          if (error) return setError(authErrorFr(error.message));
          navigate({ to: "/compte", replace: true });
        }}
      >
        <AuthField label="E-mail"><input name="email" type="email" required autoComplete="email" className={authInput} /></AuthField>
        <AuthField label="Mot de passe"><input name="password" type="password" required autoComplete="current-password" className={authInput} /></AuthField>
        <div className="text-right">
          <Link to="/mot-de-passe-oublie" className="text-sm underline underline-offset-2">Mot de passe oublié ?</Link>
        </div>
        <FormMessage error={error} />
        <button disabled={busy} className={authButton}>{busy ? "Connexion…" : "Se connecter"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ? <Link to="/inscription" className="font-medium text-foreground underline underline-offset-2">Créer un compte</Link>
      </p>
    </AuthCard>
  );
}
