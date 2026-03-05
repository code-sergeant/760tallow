import { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Differentiator from '@/components/sections/Differentiator';
import ProductCatalog from '@/components/sections/ProductCatalog';
import Origins from '@/components/sections/Origins';
import CartDrawer from '@/components/ui/CartDrawer';
import ProductDetail from '@/components/ui/ProductDetail';
import type { ShopifyProduct } from '@/types/shopify';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          <Hero />
          <Differentiator />
          <ProductCatalog onSelectProduct={setSelectedProduct} />
          <Origins />
        </main>
        <Footer />
        <CartDrawer />
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      </div>
    </CartProvider>
  );
}
