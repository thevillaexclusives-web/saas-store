import Image from "next/image";
import { Award, Clock, MessageCircle } from "lucide-react";
import type { Host } from "@/lib/storefront/types";

interface HostCardProps {
  host: Host;
}

export function HostCard({ host }: HostCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-start">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border-subtle ring-offset-2">
          <Image
            src={host.avatar ?? "/favicon.ico"}
            alt={host.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        {host.superhost && (
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--storefront-primary)] shadow-md">
            <Award className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-base font-semibold text-stone-900">
            Hosted by {host.name}
          </h4>
          {host.superhost && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--storefront-primary-border)] bg-[var(--storefront-primary-soft)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[var(--storefront-primary)]">
              Superhost
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 mb-3">
          {host.company ?? host.email ?? (host.joined ? `Member since ${host.joined}` : "Listing contact")}
        </p>

        {host.responseRate != null || host.responseTime ? (
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
            {host.responseRate != null ? (
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-stone-400" />
                {host.responseRate}% response rate
              </span>
            ) : null}
            {host.responseTime ? (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                Responds {host.responseTime}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
