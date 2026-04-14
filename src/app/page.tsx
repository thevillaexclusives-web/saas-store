import { ArrowRight, Store } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { StorefrontFooter } from "@/components/storefront/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-muted">
      <Navbar />

      <main className="mx-auto flex max-w-4xl flex-1 items-center px-6 py-20 lg:px-10">
        <div className="w-full rounded-3xl border border-border-subtle bg-surface p-10 shadow-sm">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-50 text-sand-700">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Storefront routes live under <span className="text-sand-600">/[orgSlug]/store/[slug]</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-stone-500">
            This app now serves real storefronts by route parameter. Open a configured route such
            as <span className="font-mono text-stone-700">/the-villa-exclusive/store/dubai-collection</span>,
            or configure storefronts from the admin app and assign properties to them.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`${process.env.NEXT_PUBLIC_PLATFORM_URL ?? "#"}/settings/storefronts`}
              className="inline-flex items-center gap-2 rounded-full bg-sand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sand-700"
            >
              Manage storefronts
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_PLATFORM_URL ?? "#"}/properties`}
              className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              Assign properties
            </a>
          </div>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
