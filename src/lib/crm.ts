/**
 * Types et helpers partagés du CRM.
 * Les libellés français sont séparés des valeurs stockées en base.
 */
import type { Database } from "@/integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadNote = Database["public"]["Tables"]["lead_notes"]["Row"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type LeadSource = Database["public"]["Enums"]["lead_source"];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  converti: "Converti",
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  site_web: "Site web",
  reseaux_sociaux: "Réseaux sociaux",
  recommandation: "Recommandation",
  autre: "Autre",
};

export const STATUSES = Object.keys(STATUS_LABELS) as LeadStatus[];
export const SOURCES = Object.keys(SOURCE_LABELS) as LeadSource[];

/** Formate une date ISO en date/heure lisible (fr-FR). */
export function formatDate(iso: string, withTime = false): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
