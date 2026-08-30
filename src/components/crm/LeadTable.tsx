/** Tableau des leads : Nom, Email, Source, Statut, Date d'ajout. */
import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeadStatusBadge } from "@/components/crm/LeadStatusBadge";
import { SOURCE_LABELS, formatDate, type Lead } from "@/lib/crm";

export function LeadTable({
  leads,
  loading,
  onEdit,
  onDelete,
}: {
  leads: Lead[];
  loading?: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}) {
  if (loading) {
    return <p className="p-8 text-center text-sm text-muted-foreground">Chargement…</p>;
  }

  if (leads.length === 0) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Aucun lead ne correspond à votre recherche.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/60">
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Date d'ajout</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">
              <Link
                to="/leads/$leadId"
                params={{ leadId: lead.id }}
                className="hover:text-primary hover:underline"
              >
                {lead.name}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{lead.email}</TableCell>
            <TableCell className="text-muted-foreground">
              {SOURCE_LABELS[lead.source]}
            </TableCell>
            <TableCell>
              <LeadStatusBadge status={lead.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(lead.created_at)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Modifier ${lead.name}`}
                  onClick={() => onEdit(lead)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Supprimer ${lead.name}`}
                  onClick={() => onDelete(lead)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
