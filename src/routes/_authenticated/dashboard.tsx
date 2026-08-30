/**
 * Tableau de bord : liste des leads avec recherche, filtre par statut
 * et modale d'ajout / édition.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadTable } from "@/components/crm/LeadTable";
import { LeadForm, type LeadFormValues } from "@/components/crm/LeadForm";
import { STATUSES, STATUS_LABELS, type Lead, type LeadStatus } from "@/lib/crm";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — CRM Leads" },
      {
        name: "description",
        content: "Suivez vos leads clients : recherche, filtres par statut et édition rapide.",
      },
      { property: "og:title", content: "Tableau de bord — CRM Leads" },
      {
        property: "og:description",
        content: "Vue d'ensemble de tous vos leads et de leur statut.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);

  // Lecture de tous les leads de l'utilisateur connecté (RLS côté base).
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: LeadFormValues) => {
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        source: values.source,
        status: values.status,
        notes: values.notes || null,
      };
      if (editing) {
        const { error } = await supabase.from("leads").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) throw new Error("Session expirée");
        const { error } = await supabase
          .from("leads")
          .insert({ ...payload, user_id: auth.user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Lead mis à jour" : "Lead ajouté");
      setDialogOpen(false);
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      const { error } = await supabase.from("leads").delete().eq("id", lead.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead supprimé");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => toast.error(error.message),
  });

  // Filtrage par statut + recherche nom/email.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter(
      (lead) =>
        (statusFilter === "all" || lead.status === statusFilter) &&
        (q === "" ||
          lead.name.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q)),
    );
  }, [leads, search, statusFilter]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {leads.length} lead{leads.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Ajouter un lead
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher par nom ou email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un lead"
          />
        </div>
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeadStatus | "all")}>
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            {STATUSES.map((s) => (
              <TabsTrigger key={s} value={s}>
                {STATUS_LABELS[s]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <Card className="mt-6 overflow-hidden p-0">
        <LeadTable
          leads={filtered}
          loading={isLoading}
          onEdit={(lead) => {
            setEditing(lead);
            setDialogOpen(true);
          }}
          onDelete={(lead) => deleteMutation.mutate(lead)}
        />
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le lead" : "Ajouter un lead"}</DialogTitle>
            <DialogDescription>
              Renseignez les informations de contact et le statut du lead.
            </DialogDescription>
          </DialogHeader>
          <LeadForm
            lead={editing}
            submitting={saveMutation.isPending}
            onSubmit={(values) => saveMutation.mutate(values)}
            onCancel={() => {
              setDialogOpen(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
