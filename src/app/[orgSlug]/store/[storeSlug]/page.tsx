import { notFound } from "next/navigation";
import { StorefrontListingPage } from "@/components/storefront/storefront-listing-page";
import { getStorefrontListingData } from "@/lib/storefront/data";
import { resolveStorefrontTarget } from "@/lib/storefront/resolver";

interface PageProps {
  params: Promise<{ orgSlug: string; storeSlug: string }>;
}

export default async function StorefrontPage({ params }: PageProps) {
  const { orgSlug, storeSlug } = await params;
  const target = resolveStorefrontTarget({ routeOrgSlug: orgSlug, routeStoreSlug: storeSlug });

  if (!target) {
    notFound();
  }

  const data = await getStorefrontListingData(target);
  if (!data) {
    notFound();
  }

  return <StorefrontListingPage {...data} />;
}
