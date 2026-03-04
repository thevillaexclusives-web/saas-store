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
import { DescriptionBlock } from "@/components/property-detail/description-block";
import { AmenitiesGrid } from "@/components/property-detail/amenities-grid";
import { HostCard } from "@/components/property-detail/host-card";
import {
  getPropertyById,
  defaultAmenities,
  defaultHost,
  properties,
} from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();

  const gallery = property.gallery ?? [
    property.image,
    property.image,
    property.image,
  ];
  const amenities = property.amenities ?? defaultAmenities;
  const host = property.host ?? defaultHost;
  const description =
    property.description ??
    `Discover this beautiful ${property.type.toLowerCase()} in ${property.location}, ${property.city}. Featuring ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, this property accommodates up to ${property.guests} guests.`;

  const similar = properties
    .filter((p) => p.id !== property.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-surface-muted">
      <Navbar />

      {/* Image Gallery */}
      <section className="relative mx-auto max-w-[1400px] px-6 lg:px-10 pt-6">
        <ImageGallery images={gallery} name={property.name} />
      </section>

      {/* Breadcrumb + Actions */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 mt-6">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-1.5 text-sm text-stone-400">
            <Link
              href="/"
              className="hover:text-sand-600 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:text-sand-600 transition-colors cursor-pointer">
              {property.city}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="hover:text-sand-600 transition-colors cursor-pointer">
              {property.location}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-600 font-medium truncate max-w-[200px]">
              {property.name}
            </span>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors">
              <Heart className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Main content: two-column */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 mt-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">
            {/* Title block */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-flex px-3 py-1 bg-sand-50 border border-sand-200 rounded-full text-xs font-bold text-sand-700 uppercase tracking-wider">
                  {property.type}
                </span>
                {property.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sand-500 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    <svg
                      viewBox="0 0 12 12"
                      fill="currentColor"
                      className="w-2.5 h-2.5"
                    >
                      <path d="M6 0l1.76 3.77L12 4.38 8.91 7.23 9.71 12 6 9.97 2.29 12l.8-4.77L0 4.38l4.24-.61z" />
                    </svg>
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold text-stone-900 tracking-tight leading-tight mb-3">
                {property.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-1.5 text-sm text-stone-600">
                  <MapPin className="w-4 h-4 text-sand-500" />
                  {property.location}, {property.city}, {property.country}
                </span>
                <span className="w-px h-4 bg-stone-200 hidden sm:block" />
                <span className="flex items-center gap-1.5 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-stone-800">
                    {property.rating.toFixed(1)}
                  </span>
                  <span className="text-stone-400">
                    ({property.reviewCount} reviews)
                  </span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border-subtle mb-8" />

            {/* Quick specs */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {property.guests} guests
                  </p>
                  <p className="text-xs text-stone-400">Max occupancy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center">
                  <BedDouble className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "bedroom" : "bedrooms"}
                  </p>
                  <p className="text-xs text-stone-400">Sleeping areas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center">
                  <Bath className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "bathroom" : "bathrooms"}
                  </p>
                  <p className="text-xs text-stone-400">Full baths</p>
                </div>
              </div>
              {property.areaSqm && (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center">
                    <Maximize className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {property.areaSqm} m²
                    </p>
                    <p className="text-xs text-stone-400">Living area</p>
                  </div>
                </div>
              )}
            </div>

            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <>
                <div className="border-t border-border-subtle mb-8" />
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {property.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sand-50 border border-sand-100 rounded-full text-sm font-medium text-sand-800"
                    >
                      <CircleCheck className="w-3.5 h-3.5 text-sand-500" />
                      {h}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Description */}
            <div className="border-t border-border-subtle pt-8 mb-8">
              <h2 className="text-lg font-bold text-stone-900 mb-4">
                About this property
              </h2>
              <DescriptionBlock description={description} />
            </div>

            {/* Amenities */}
            <div className="border-t border-border-subtle pt-8 mb-8">
              <h2 className="text-lg font-bold text-stone-900 mb-5">
                What this place offers
              </h2>
              <AmenitiesGrid amenities={amenities} />
            </div>

            {/* Host */}
            <div className="border-t border-border-subtle pt-8">
              <h2 className="text-lg font-bold text-stone-900 mb-5">
                Your host
              </h2>
              <HostCard host={host} />
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky booking card */}
          <div className="w-full lg:w-[400px] shrink-0">
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

      {/* Similar properties */}
      <section className="border-t border-border-subtle bg-surface-muted">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 sm:py-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">
            Similar properties you may like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {similar.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sand-500 to-sand-700 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3.5 h-3.5 text-white"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <span className="font-semibold text-stone-700">
                Villa<span className="text-sand-600">Hub</span>
              </span>
            </div>
            <p>
              &copy; {new Date().getFullYear()} VillaHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
