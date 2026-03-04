import Image from "next/image";
import { Award, Clock, MessageCircle } from "lucide-react";
import type { Host } from "@/lib/mock-data";

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
            src={host.avatar}
            alt={host.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        {host.superhost && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center shadow-md">
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sand-50 border border-sand-200 rounded-full text-[11px] font-bold text-sand-700 uppercase tracking-wider">
              Superhost
            </span>
          )}
        </div>
        <p className="text-sm text-stone-500 mb-3">
          Member since {host.joined}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
          <span className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-stone-400" />
            {host.responseRate}% response rate
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-stone-400" />
            Responds {host.responseTime}
          </span>
        </div>
      </div>
    </div>
  );
}
