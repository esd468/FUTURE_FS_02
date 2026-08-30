/** Page d'accueil publique : présentation courte + accès à la connexion. */
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, ListChecks, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRM Leads — Suivi simple de vos leads clients" },
      {
        name: "description",
        content:
          "CRM léger pour centraliser les leads issus de votre formulaire de contact : statuts, notes de suivi et recherche instantanée.",
      },
      { property: "og:title", content: "CRM Leads — Suivi simple de vos leads clients" },
      {
        property: "og:description",
        content: "Centralisez, qualifiez et convertissez vos leads en quelques clics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sidebar-border px-3 py-1 text-xs">
          <Users className="size-3.5" /> CRM Leads
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Vos leads clients, enfin sous contrôle
        </h1>
        <p className="mt-4 max-w-xl text-sm text-sidebar-foreground/80 sm:text-base">
          Centralisez les contacts issus de votre formulaire, suivez leur statut et gardez
          l'historique de chaque échange. Simple, rapide, professionnel.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-8">
          <Link to="/auth">Accéder au CRM</Link>
        </Button>

        <div className="mt-16 grid w-full gap-4 text-left sm:grid-cols-3">
          <Feature icon={<ListChecks className="size-5" />} title="Statuts clairs">
            Nouveau, contacté, converti — badges colorés pour voir l'essentiel.
          </Feature>
          <Feature icon={<BarChart3 className="size-5" />} title="Recherche & filtres">
            Retrouvez un lead par nom ou email en une frappe.
          </Feature>
          <Feature icon={<Users className="size-5" />} title="Suivi horodaté">
            Chaque note de relance est datée et conservée.
          </Feature>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-4">
      <div className="text-sidebar-foreground">{icon}</div>
      <h2 className="mt-3 text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs text-sidebar-foreground/75">{children}</p>
    </div>
  );
}
