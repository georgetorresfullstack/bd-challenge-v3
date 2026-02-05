"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { type GetProductByHandleQuery } from "@/lib/shopify/graphql/.generated/storefront.generated";
import { ProductDetails } from "./ProductDetails";
import { SkeletonLoader } from "./SkeletonLoader";

interface QuickViewModalProps {
  productHandle: string | null;
  onClose: () => void;
}

export function QuickViewModal({ productHandle, onClose }: QuickViewModalProps) {
  const [product, setProduct] = useState<GetProductByHandleQuery["product"] | null>(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!productHandle) {
      setProduct(null);
      return;
    }

    setLoading(true);
    previousFocusRef.current = document.activeElement as HTMLElement;

    async function fetchProduct() {
      try {
        const resp = await fetch(`/api/products/${productHandle}`);
        const data = await resp.json();
        console.log("/.......resp", resp?.json);
        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
      previousFocusRef.current?.focus();
    };
  }, [productHandle, onClose]);

  useEffect(() => {
    if (!productHandle || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [productHandle, loading, product]);

  useEffect(() => {
    if (productHandle && modalRef.current && !loading) {
      modalRef.current.focus();
    }
  }, [productHandle, loading]);

  return (
    <AnimatePresence>
      {productHandle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/20 dark:bg-black/40 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 400,
              mass: 0.8
            }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl focus:outline-none scrollbar-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10 lg:p-12">
              {loading ? (
                <SkeletonLoader />
              ) : product ? (
                <ProductDetails product={product} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-zinc-500">Product not found.</p>
                  <button onClick={onClose} className="mt-4 text-zinc-900 dark:text-white font-medium underline">
                    Return to shop
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
