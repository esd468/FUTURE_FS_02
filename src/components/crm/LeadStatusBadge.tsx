/** Badge coloré représentant le statut d'un lead. */
import { STATUS_LABELS, type LeadStatus } from "@/lib/crm";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<LeadStatus, string> = {
  nouveau: "bg-status-new-soft text-status-new border-status-new/20",
  contacte: "bg-status-contacted-soft text-status-contacted border-status-contacted/25",
  converti: "bg-status-converted-soft text-status-converted border-status-converted/25",
};

export function LeadStatusBadge({
  status,
  className,
}: {
  status: LeadStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_CLASSES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
