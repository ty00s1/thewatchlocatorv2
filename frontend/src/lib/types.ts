export type WPImage = {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
};

export type WPPriceData = {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  price: string;
  regular_price: string;
  sale_price: string;
};

export type WPProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: WPPriceData;
  images: WPImage[];
  categories: { id: number; name: string; slug: string }[];
  is_in_stock: boolean;
  is_purchasable: boolean;
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image: WPImage | null;
};

export type CartItem = {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink: string;
  images: WPImage[];
  prices: WPPriceData;
  totals: { line_total: string; line_subtotal: string; currency_code: string; currency_minor_unit: number };
};

export type Cart = {
  items: CartItem[];
  items_count: number;
  totals: {
    total_items: string;
    total_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
  };
};
