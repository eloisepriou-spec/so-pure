import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Client-side session state, kept fresh by Supabase auth events. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setReady(true);
    });
    supabase.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, user: session?.user ?? null, ready };
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/compte` },
  });
}

/** Translate common Supabase auth errors into French. */
export function authErrorFr(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou mot de passe incorrect.";
  if (m.includes("email not confirmed")) return "Confirmez d'abord votre e-mail via le lien reçu.";
  if (m.includes("already registered")) return "Un compte existe déjà avec cet e-mail.";
  if (m.includes("password should be")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (m.includes("provider is not enabled")) return "La connexion Google n'est pas encore activée.";
  return message;
}

export type Role = "customer" | "brand" | "admin";

export async function fetchRole(userId: string): Promise<Role> {
  const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  return ((data as { role?: Role } | null)?.role ?? "customer") as Role;
}

/** Role of the signed-in user's profile (null while signed out). */
export function useRole() {
  const { user, ready } = useSession();
  const q = useQuery({
    queryKey: ["role", user?.id],
    queryFn: () => fetchRole(user!.id),
    enabled: !!user,
  });
  const role: Role | null = user ? (q.data ?? null) : null;
  return { role, isAdmin: role === "admin", loading: !ready || (!!user && q.isLoading) };
}
