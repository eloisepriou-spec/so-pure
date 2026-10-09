import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthCard, AuthField, FormMessage, authButton, authInput } from "@/components/site/AuthCard";
import { authErrorFr } from "@/lib/auth";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — So Pure" },
      { name: "description", content: "Choisissez un nouveau mot de passe pour votre compte So Pure." },
      { property: "og:title", content: "Nouveau mot de passe — So Pure" },
      { property: "og:description", content: "Réinitialisation du mot de passe So Pure." },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const recovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setOk(true);
    });
    supabase.auth.getSession().then(({ data: d }) => setOk(recovery || !!d.session));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthCard title="Nouveau mot de passe">
      {ok === false ? (
        <p className="text-sm">Ce lien est invalide ou a expiré. Demandez un nouveau lien depuis « Mot de passe oublié ».</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const password = String(fd.get("password"));
            if (password !== String(fd.get("confirm"))) return setError("Les deux mots de passe ne correspondent pas.");
            setBusy(true);
            setError(null);
            const { error } = await supabase.auth.updateUser({ password });
            setBusy(false);
            if (error) return setError(authErrorFr(error.message));
            navigate({ to: "/compte", replace: true });
          }}
        >
          <AuthField label="Nouveau mot de passe"><input name="password" type="password" minLength={6} required autoComplete="new-password" className={authInput} /></AuthField>
          <AuthField label="Confirmer"><input name="confirm" type="password" minLength={6} required autoComplete="new-password" className={authInput} /></AuthField>
          <FormMessage error={error} />
          <button disabled={busy} className={authButton}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
        </form>
      )}
    </AuthCard>
  );
}
