"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { QuickViewModal } from "./QuickViewModal";
import { type GetCollectionProductsQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

interface ProductListingProps {
  initialProducts: NonNullable<GetCollectionProductsQuery["collection"]>["products"]["edges"];
}

function ProductListingContent({ initialProducts }: ProductListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const selectedProductHandle = searchParams.get("product");

  const handleOpenModal = (handle: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", handle);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("product");
    router.push(pathname, { scroll: false });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 max-w-7xl mx-auto py-12">
        {initialProducts.map(({ node }) => (
          <ProductCard
            key={node.id}
            product={node}
            onQuickView={handleOpenModal}
          />
        ))}
      </div>

      <QuickViewModal
        productHandle={selectedProductHandle}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export function ProductListing(props: ProductListingProps) {
  return (
    <Suspense fallback={
      <div className="w-full py-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    }>
      <ProductListingContent {...props} />
    </Suspense>
  );
}
