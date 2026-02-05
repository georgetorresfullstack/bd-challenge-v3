"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { type GetProductByHandleQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";
import { AddToBagButton } from "./AddToBagButton";

type Product = NonNullable<GetProductByHandleQuery["product"]>;

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const firstVariantOptions: Record<string, string> = {};
    const firstVariant = product.variants.edges[0]?.node;
    firstVariant?.selectedOptions.forEach((opt) => {
      firstVariantOptions[opt.name] = opt.value;
    });
    return firstVariantOptions;
  });

  const [manualImage, setManualImage] = useState<{ url: string; altText?: string | null } | null>(null);

  const selectedVariant = useMemo(() => {
    return product.variants.edges.find(({ node }) => {
      return node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    })?.node;
  }, [product.variants, selectedOptions]);

  useEffect(() => {
    setManualImage(null);
  }, [selectedVariant]);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const isOptionValueEnabled = (optionName: string, value: string) => {
    return product.variants.edges.some(({ node }) => {
      if (!node.availableForSale) return false;
      
      const matchesDesiredOption = node.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === value
      );
      if (!matchesDesiredOption) return false;

      return node.selectedOptions.every((opt) => {
        if (opt.name === optionName) return true;
        return selectedOptions[opt.name] === opt.value;
      });
    });
  };

  const currentImage = manualImage || selectedVariant?.image || product.images.edges[0]?.node;
  const currentPrice = selectedVariant?.price || { amount: "0", currencyCode: "USD" };

  const staggerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  // Keyboard navigation for options
  const handleKeyDown = (e: React.KeyboardEvent, optionName: string, currentValue: string, allValues: string[]) => {
    const currentIndex = allValues.indexOf(currentValue);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % allValues.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + allValues.length) % allValues.length;
    }

    if (nextIndex !== currentIndex) {
      const nextValue = allValues[nextIndex];
      // Skip if disabled, simple approach: just try to set it
      // A more robust way would be to find the next *enabled* value
      handleOptionChange(optionName, nextValue);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pb-24 md:pb-0">
      {/* Media Column */}
      <div className="w-full md:w-1/2 space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800">
          <motion.div
            layoutId={`image-${product.handle}`}
            className="w-full h-full"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage?.url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {currentImage ? (
                  <Image
                    src={currentImage.url}
                    alt={currentImage.altText || product.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    No image
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          custom={4}
          variants={staggerVariants}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-none"
        >
          {product.images.edges.map(({ node }, i) => (
            <button
              key={node.url}
              onClick={() => setManualImage(node)}
              className={`relative flex-shrink-0 w-20 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                currentImage?.url === node.url ? "border-black dark:border-white scale-95" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={node.url} alt={node.altText || ""} fill className="object-cover" />
            </button>
          ))}
        </motion.div>
      </div>

      {/* Content Column */}
      <div className="w-full md:w-1/2 flex flex-col pt-2">
        <motion.div 
          className="mb-6"
          initial="hidden"
          animate="visible"
          custom={0}
          variants={staggerVariants}
        >
          <h2 id="modal-title" className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
            {product.title}
          </h2>
          <motion.p 
            key={currentPrice.amount}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
          >
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currentPrice.currencyCode,
            }).format(parseFloat(currentPrice.amount))}
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {product.options.map((option, idx) => {
            if (option.name === "Title" && option.values.length === 1 && option.values[0] === "Default Title") {
              return null;
            }

            return (
              <motion.div 
                key={option.name} 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                custom={idx + 1}
                variants={staggerVariants}
              >
                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {option.name}
                </span>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isActive = selectedOptions[option.name] === value;
                    const isEnabled = isOptionValueEnabled(option.name, value);
                    
                    return (
                      <button
                        key={value}
                        role="radio"
                        aria-checked={isActive}
                        disabled={!isEnabled}
                        onClick={() => handleOptionChange(option.name, value)}
                        onKeyDown={(e) => handleKeyDown(e, option.name, value, option.values)}
                        className={`
                          relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black dark:focus-visible:ring-white
                          ${isActive 
                            ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105 z-10" 
                            : isEnabled
                              ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                              : "bg-zinc-50 text-zinc-300 cursor-not-allowed dark:bg-zinc-900 dark:text-zinc-700"
                          }
                        `}
                      >
                        {value}
                        {isActive && (
                          <motion.div
                            layoutId="activeOption"
                            className="absolute inset-0 rounded-full border-2 border-zinc-900 dark:border-white -m-[2px]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {/* Description */}
          <motion.div 
            initial="hidden"
            animate="visible"
            custom={product.options.length + 1}
            variants={staggerVariants}
            className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 line-clamp-4"
          >
            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          </motion.div>
        </div>

        {/* Action - Sticky on mobile / Standard on desktop */}
        <motion.div 
          initial="hidden"
          animate="visible"
          custom={product.options.length + 2}
          variants={staggerVariants}
          className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 hidden md:block"
        >
          <AddToBagButton 
            disabled={!selectedVariant?.availableForSale} 
            onAdd={() => {
            }} 
          />
          {!selectedVariant?.availableForSale && (
            <p className="mt-3 text-center text-sm text-red-500 font-medium">
              This combination is currently unavailable.
            </p>
          )}
        </motion.div>
      </div>

       {/* Sticky Mobile CTA */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 md:hidden z-20">
        <AddToBagButton 
          disabled={!selectedVariant?.availableForSale} 
          onAdd={() => {
          }} 
        />
      </div>
    </div>
  );
}
