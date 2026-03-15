export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
  };
}

export interface ShopifyCartLineMerchandise {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  product: {
    title: string;
    images: {
      edges: Array<{ node: ShopifyImage }>;
    };
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyCartLineMerchandise;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}
