"use client";

import { useState } from "react";
import { BentoGallery } from "@/components/stay/bento-gallery";
import { PhotoTour } from "@/components/stay/photo-tour";
import { bentoPhotos, groupedPhotos, type Stay } from "@/lib/data";

/**
 * Owns the two pieces of gallery state (bento selection + tour visibility) so
 * the server page stays a pure document. Photos are passed down already
 * resolved — no client-side data fetching for something this static.
 */
export function GallerySection({ stay }: { stay: Stay }) {
  const [tourOpen, setTourOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const tiles = bentoPhotos(stay);
  const groups = groupedPhotos(stay);

  function openAt(bentoIndex: number) {
    const photo = tiles[bentoIndex];
    const realIndex = Math.max(
      0,
      stay.photos.findIndex((p) => p.id === photo?.id),
    );
    setStartIndex(realIndex);
    setTourOpen(true);
  }

  return (
    <>
      <BentoGallery
        photos={tiles}
        allPhotos={stay.photos}
        total={stay.photos.length}
        onOpen={openAt}
      />
      <PhotoTour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        photos={stay.photos}
        grouped={groups}
        startIndex={startIndex}
      />
    </>
  );
}
