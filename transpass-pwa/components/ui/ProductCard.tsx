import Link from "next/link";
import Image from "next/image";
import { Product } from "../../lib/products";

interface ProductCardProps {
  product: Product;
  showStats?: boolean;
}

export function ProductCard({ product, showStats = false }: ProductCardProps) {
  return (
    <Link href={`/company/products/${product.id}`} className="block group">
      <div className="transition-all duration-200 hover:opacity-90">
        <div className="aspect-square w-full relative bg-primary-lightest rounded-xl overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-primary text-2xl font-medium">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="pt-3 px-1">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-dark font-medium text-xl truncate pr-2">
              {product.name}
            </h3>

            {showStats && (
              <div className="flex items-center text-xs text-gray shrink-0">
                <svg
                  className="flex-shrink-0 mr-1 h-3.5 w-3.5 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {Math.floor(Math.random() * 500)}
              </div>
            )}
          </div>

          <p className="text-sm text-gray truncate mt-0.5">
            {product.model || "No model"}
          </p>
        </div>
      </div>
    </Link>
  );
}
