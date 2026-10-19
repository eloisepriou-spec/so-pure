export function Empty({ children }: { children: string }) {
  return (
    <p className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}
