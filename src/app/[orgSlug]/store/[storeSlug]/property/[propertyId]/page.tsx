import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Star,
  Share2,
  Heart,
  Users,
  BedDouble,
  Bath,
  Maximize,
  ChevronRight,
  CircleCheck,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PropertyCard } from "@/components/property-card";
import { ImageGallery } from "@/components/property-detail/image-gallery";
import { BookingCard } from "@/components/property-detail/booking-card";
import { ApproximateLocationMap } from "@/components/property-detail/approximate-location-map";
import { DescriptionBlock } from "@/components/property-detail/description-block";
import { AmenitiesGrid } from "@/components/property-detail/amenities-grid";
import { HostCard } from "@/components/property-detail/host-card";
import { StorefrontFooter } from "@/components/storefront/footer";
import { storefrontBrandStyle } from "@/lib/storefront/branding";
import { getStorefrontPropertyDetailData } from "@/lib/storefront/data";
import { resolveStorefrontTarget, storefrontPath } from "@/lib/storefront/resolver";

interface PageProps {
  params: Promise<{ orgSlug: string; storeSlug: string; propertyId: string }>;
}

export default async function StorefrontPropertyDetailPage({ params }: PageProps) {
  const { orgSlug, storeSlug, propertyId } = await params;
  const target = resolveStorefrontTarget({ routeOrgSlug: orgSlug, routeStoreSlug: storeSlug });

  if (!target) {
    notFound();
  }

  const data = await getStorefrontPropertyDetailData(target, propertyId);
  if (!data) {
    notFound();
  }

  const { storefront, branding, property, similar } = data;
  const gallery = property.gallery;
  const amenities = property.amenities ?? [];
  const description =
    property.description ??
    `Discover ${property.name} in ${property.location}, ${property.city}. This property offers ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, with room for up to ${property.guests} guests.`;

  return (
    <div
      className="min-h-screen bg-surface-muted"
      style={storefrontBrandStyle(branding)}
    >
      <Navbar
        homeHref={storefrontPath({ orgSlug: storefront.orgSlug, storeSlug: storefront.slug })}
        branding={branding}
      />

      <section className="relative mx-auto max-w-[1400px] px-6 pt-6 lg:px-10">
        <ImageGallery images={gallery} name={property.name} />
      </section>

      <div className="mx-auto mt-6 max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-sm text-stone-400">
            <Link
              href={storefrontPath({ orgSlug: storefront.orgSlug, storeSlug: storefront.slug })}
              className="transition-colors hover:text-[var(--storefront-primary)]"
            >
              {storefront.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{property.city}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{property.location}</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-[200px] truncate font-medium text-stone-600">
              {property.name}
            </span>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <button className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100">
              <Heart className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-[1400px] px-6 pb-16 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <div className="min-w-0 flex-1">
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex rounded-full border border-[var(--storefront-primary-border)] bg-[var(--storefront-primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--storefront-primary)]">
                  {property.type}
                </span>
                {property.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--storefront-primary)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--storefront-primary-foreground)]">
                    <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5">
                      <path d="M6 0l1.76 3.77L12 4.38 8.91 7.23 9.71 12 6 9.97 2.29 12l.8-4.77L0 4.38l4.24-.61z" />
                    </svg>
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-stone-900 sm:text-3xl lg:text-[2.1rem]">
                {property.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5 text-sm text-stone-600">
                  <MapPin className="h-4 w-4 text-[var(--storefront-primary)]" />
                  {property.location}, {property.city}, {property.country}
                </span>
                <span className="hidden h-4 w-px bg-stone-200 sm:block" />
                {property.rating != null ? (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-stone-800">
                      {property.rating.toFixed(1)}
                    </span>
                    <span className="text-stone-400">
                      ({property.reviewCount ?? 0} reviews)
                    </span>
                  </span>
                ) : (
                  <span className="text-sm font-medium text-stone-400">New listing</span>
                )}
              </div>
            </div>

            <div className="mb-8 border-t border-border-subtle" />

            <div className="mb-8 flex flex-wrap gap-6 sm:gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                  <Users className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{property.guests} guests</p>
                  <p className="text-xs text-stone-400">Max occupancy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                  <BedDouble className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
                  </p>
                  <p className="text-xs text-stone-400">Sleeping areas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                  <Bath className="h-5 w-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {property.bathrooms} {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
                  </p>
                  <p className="text-xs text-stone-400">Full baths</p>
                </div>
              </div>
              {property.areaSqm ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100">
                    <Maximize className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{property.areaSqm} m²</p>
                    <p className="text-xs text-stone-400">Living area</p>
                  </div>
                </div>
              ) : null}
            </div>

            {property.highlights && property.highlights.length > 0 ? (
              <>
                <div className="mb-8 border-t border-border-subtle" />
                <div className="mb-8 flex flex-wrap gap-2.5">
                  {property.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--storefront-primary-border)] bg-[var(--storefront-primary-soft)] px-3.5 py-2 text-sm font-medium text-[var(--storefront-primary)]"
                    >
                      <CircleCheck className="h-3.5 w-3.5 text-[var(--storefront-primary)]" />
                      {highlight}
                    </span>
                  ))}
                </div>
              </>
            ) : null}

            <div className="mb-8 border-t border-border-subtle pt-8">
              <h2 className="mb-4 text-lg font-bold text-stone-900">About this property</h2>
              <DescriptionBlock description={description} />
            </div>

            {property.latitude != null && property.longitude != null ? (
              <div className="mb-8 border-t border-border-subtle pt-8">
                <div className="mb-5 flex flex-col gap-1">
                  <h2 className="text-lg font-bold text-stone-900">Where you’ll be</h2>
                  <p className="text-sm text-stone-500">
                    Approximate location shown for privacy.
                  </p>
                </div>
                <ApproximateLocationMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                />
              </div>
            ) : null}

            {amenities.length > 0 ? (
              <div className="mb-8 border-t border-border-subtle pt-8">
                <h2 className="mb-5 text-lg font-bold text-stone-900">What this place offers</h2>
                <AmenitiesGrid amenities={amenities} />
              </div>
            ) : null}

            {property.host ? (
              <div className="border-t border-border-subtle pt-8">
                <h2 className="mb-5 text-lg font-bold text-stone-900">Listing contact</h2>
                <HostCard host={property.host} />
              </div>
            ) : null}
          </div>

          <div className="w-full shrink-0 lg:w-[400px]">
            <div className="lg:sticky lg:top-[96px]">
              <BookingCard
                price={property.price}
                currency={property.currency}
                period={property.period}
                rating={property.rating}
                reviewCount={property.reviewCount}
              />
            </div>
          </div>
        </div>
      </div>

      {similar.length > 0 ? (
        <section className="border-t border-border-subtle bg-surface-muted">
          <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 sm:py-16">
            <h2 className="mb-8 text-2xl font-bold text-stone-900">Similar properties you may like</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {similar.map((similarProperty, index) => (
                <PropertyCard
                  key={similarProperty.id}
                  property={similarProperty}
                  index={index}
                  orgSlug={storefront.orgSlug}
                  storeSlug={storefront.slug}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <StorefrontFooter branding={branding} />
    </div>
  );
}
