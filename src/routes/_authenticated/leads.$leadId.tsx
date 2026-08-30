/**
 * Détail d'un lead : informations complètes, changement rapide de statut
 * et historique des notes de suivi horodatées.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LeadStatusBadge } from "@/components/crm/LeadStatusBadge";
import {
  SOURCE_LABELS,
  STATUSES,
  STATUS_LABELS,
  formatDate,
  type Lead,
  type LeadNote,
  type LeadStatus,
} from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/leads/$leadId")({
  head: () => ({
    meta: [
      { title: "Détail du lead — CRM Leads" },
      {
        name: "description",
        content: "Fiche complète du lead : coordonnées, statut et historique des suivis.",
      },
      { property: "og:title", content: "Détail du lead — CRM Leads" },
      {
        property: "og:description",
        content: "Coordonnées, statut et notes de suivi horodatées du lead.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeadDetail,
});

function LeadDetail() {
  const { leadId } = Route.useParams();
  const queryClient = useQueryClient();
  const [noteContent, setNoteContent] = useState("");

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .maybeSingle();
      if (error) throw error;
      return data as Lead | null;
    },
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["lead-notes", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_notes")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LeadNote[];
    },
  });

  const statusMutation = useMutation({
    mutationFn: async (status: LeadStatus) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const noteMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Session expirée");
      const { error } = await supabase
        .from("lead_notes")
        .insert({ lead_id: leadId, user_id: auth.user.id, content });
      if (error) throw error;
    },
    onSuccess: () => {
      setNoteContent("");
      queryClient.invalidateQueries({ queryKey: ["lead-notes", leadId] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) {
    return <p className="p-10 text-center text-sm text-muted-foreground">Chargement…</p>;
  }

  if (!lead) {
    return (
      <div className="p-10 text-center">
        <p className="text-sm text-muted-foreground">Ce lead n'existe pas.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/dashboard">Retour aux leads</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Retour aux leads
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <p className="text-sm text-muted-foreground">{lead.email}</p>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Téléphone" value={lead.phone || "—"} />
            <InfoRow label="Source" value={SOURCE_LABELS[lead.source]} />
            <InfoRow label="Date d'ajout" value={formatDate(lead.created_at, true)} />
            <InfoRow label="Dernière modification" value={formatDate(lead.updated_at, true)} />
            <div>
              <p className="text-muted-foreground">Notes</p>
              <p className="mt-1 whitespace-pre-wrap">{lead.notes || "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Changer le statut</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <Button
                key={status}
                variant={status === lead.status ? "default" : "outline"}
                size="sm"
                disabled={statusMutation.isPending || status === lead.status}
                onClick={() => statusMutation.mutate(status)}
              >
                {STATUS_LABELS[status]}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Historique des suivis</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const content = noteContent.trim();
              if (!content) return;
              noteMutation.mutate(content);
            }}
          >
            <Textarea
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Ajouter une note de suivi (appel, email, relance…)"
              maxLength={2000}
              aria-label="Nouvelle note de suivi"
            />
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={noteMutation.isPending}>
                Ajouter la note
              </Button>
            </div>
          </form>

          <ul className="mt-6 space-y-4">
            {notes.length === 0 ? (
              <li className="text-sm text-muted-foreground">Aucune note pour l'instant.</li>
            ) : (
              notes.map((note) => (
                <li key={note.id} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(note.created_at, true)}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{note.content}</p>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
