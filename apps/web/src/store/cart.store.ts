import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICartItem, IProduct, ISelectedCustomization, ICoupon } from '@smashd/types';

interface CartState {
  items: ICartItem[];
  coupon: ICoupon | null;
  discountAmount: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  taxPercentage: number;
  customerNotes?: string;

  // Actions
  addItem: (product: IProduct, customizations?: ISelectedCustomization[], quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  applyCoupon: (coupon: ICoupon, discountAmount: number) => void;
  removeCoupon: () => void;
  setCustomerNotes: (notes: string) => void;
  clearCart: () => void;

  // Selectors / Computations
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const generateCartItemId = (productId: string, customizations: ISelectedCustomization[] = []): string => {
  if (!customizations || customizations.length === 0) {
    return productId;
  }
  const customStr = [...customizations]
    .sort((a, b) => a.groupName.localeCompare(b.groupName) || a.choiceName.localeCompare(b.choiceName))
    .map((c) => `${c.groupName}:${c.choiceName}`)
    .join('|');
  return `${productId}_${customStr}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      discountAmount: 0,
      deliveryFee: 49,
      freeDeliveryThreshold: 499,
      taxPercentage: 5,
      customerNotes: '',

      addItem: (product, customizations = [], quantity = 1) => {
        const customPriceDelta = customizations.reduce((acc, c) => acc + (c.priceDelta || 0), 0);
        const unitPrice = product.price + customPriceDelta;
        const itemId = generateCartItemId(product._id || product.id, customizations);

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === itemId);
          if (existingIndex > -1) {
            const updated = [...state.items];
            const newQty = updated[existingIndex].quantity + quantity;
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: newQty,
              totalPrice: newQty * unitPrice,
            };
            return { items: updated };
          }

          const newItem: ICartItem = {
            id: itemId,
            product,
            quantity,
            selectedCustomizations: customizations,
            unitPrice,
            totalPrice: unitPrice * quantity,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  totalPrice: item.unitPrice * quantity,
                }
              : item
          ),
        }));
      },

      applyCoupon: (coupon, discountAmount) => {
        set({ coupon, discountAmount });
      },

      removeCoupon: () => {
        set({ coupon: null, discountAmount: 0 });
      },

      setCustomerNotes: (customerNotes) => {
        set({ customerNotes });
      },

      clearCart: () => {
        set({ items: [], coupon: null, discountAmount: 0, customerNotes: '' });
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      getDiscount: () => {
        return get().discountAmount;
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const discountedSubtotal = Math.max(0, subtotal - discount);
        if (discountedSubtotal === 0) return 0;
        return discountedSubtotal >= get().freeDeliveryThreshold ? 0 : get().deliveryFee;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxable = Math.max(0, subtotal - discount);
        return Math.round((taxable * get().taxPercentage) / 100);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const delivery = get().getDeliveryFee();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount) + delivery + tax;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'smashd-cart-storage',
    }
  )
);
