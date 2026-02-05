"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { type GetCollectionProductsQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";

type Product = NonNullable<GetCollectionProductsQuery["collection"]>["products"]["edges"][number]["node"];

interface ProductCardProps {
  product: Product;
  onQuickView: (handle: string) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  const handlePrefetch = () => {
    fetch(`/api/products/${product.handle}`).catch(() => {
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={handlePrefetch}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-zinc-100 dark:border-zinc-800"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {image ? (
          <motion.div 
            layoutId={`image-${product.handle}`}
            className="w-full h-full"
          >
            <Image
              src={image.url}
              alt={image.altText || product.title}
              width={image.width || 800}
              height={image.height || 800}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onQuickView(product.handle)}
            className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm text-black dark:text-white px-6 py-2.5 rounded-full font-medium shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white dark:hover:bg-zinc-700 active:scale-95"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currencyCode,
          }).format(parseFloat(price.amount))}
        </p>
      </div>
    </motion.div>
  );
}
