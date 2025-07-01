// src/contexts/CartContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// 1. SỬA ĐỔI: Thêm `variantId` vào CartItem
export interface CartItem {
  id: string; // ID duy nhất trong giỏ hàng, vd: "product123-variant45"
  productId: string;
  variantId: string; // <-- THÊM MỚI
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: string; // Tên của variant (vd: "Hộp")
}

// 2. SỬA ĐỔI: Cập nhật chữ ký của các hàm
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateVariant: (oldItemId: string, newVariant: { type: string; price: number; variantId: string }) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('shopping_cart');
      if (storedCart) setCartItems(JSON.parse(storedCart));
    } catch (error) {
      console.error("Lỗi đọc giỏ hàng từ localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((itemToAdd: Omit<CartItem, 'id'>) => {
    // SỬA ĐỔI: Tạo ID duy nhất bằng productId và variantId
    const cartItemId = `${itemToAdd.productId}-${itemToAdd.variantId}`;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
      } else {
        return [...prevItems, { ...itemToAdd, id: cartItemId }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
        .filter(item => item.quantity > 0)
    );
  }, []);

  const updateVariant = useCallback((oldItemId: string, newVariant: { type: string; price: number; variantId: string }) => {
    setCartItems(prevItems => {
        const itemToUpdate = prevItems.find(item => item.id === oldItemId);
        if (!itemToUpdate) return prevItems;

        const newItemId = `${itemToUpdate.productId}-${newVariant.variantId}`;
        const filteredItems = prevItems.filter(item => item.id !== oldItemId);
        const existingItem = filteredItems.find(item => item.id === newItemId);

        if (existingItem) {
            return filteredItems.map(item => 
                item.id === newItemId ? { ...item, quantity: item.quantity + itemToUpdate.quantity } : item
            );
        } else {
            return [...filteredItems, { 
                ...itemToUpdate, 
                id: newItemId, 
                type: newVariant.type, 
                price: newVariant.price,
                variantId: newVariant.variantId 
            }];
        }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);
  
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateVariant,
    clearCart,
    itemCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}