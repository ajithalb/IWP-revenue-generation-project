import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'sasti_boutique_cart';

export function CartProvider({ children, showToast }) {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // Add to cart with stock validation and variant support
  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1);
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard');
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');
    
    // Unique key per product variant
    const variantKey = `${product.id}_${size}_${color}`;

    let exceededStock = false;

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.variantKey === variantKey);

      if (existingIndex > -1) {
        const existingItem = prevCart[existingIndex];
        const newTotalQty = existingItem.quantity + qtyToAdd;

        if (newTotalQty > product.stock) {
          exceededStock = true;
          if (showToast) showToast(`Only ${product.stock} units available in stock for ${product.name}!`, 'error');
          const updated = [...prevCart];
          updated[existingIndex] = { ...existingItem, quantity: product.stock };
          return updated;
        }

        const updated = [...prevCart];
        updated[existingIndex] = { ...existingItem, quantity: newTotalQty };
        return updated;
      } else {
        if (qtyToAdd > product.stock) {
          exceededStock = true;
          if (showToast) showToast(`Only ${product.stock} units available in stock!`, 'error');
          return [
            ...prevCart,
            {
              variantKey,
              id: product.id,
              product_id: product.id,
              name: product.name,
              price: product.price,
              original_price: product.original_price,
              stock: product.stock,
              image_url: product.image_url,
              category: product.category,
              selected_size: size,
              selected_color: color,
              quantity: product.stock
            }
          ];
        }

        return [
          ...prevCart,
          {
            variantKey,
            id: product.id,
            product_id: product.id,
            name: product.name,
            price: product.price,
            original_price: product.original_price,
            stock: product.stock,
            image_url: product.image_url,
            category: product.category,
            selected_size: size,
            selected_color: color,
            quantity: qtyToAdd
          }
        ];
      }
    });

    if (!exceededStock && showToast) {
      showToast(`Added "${product.name}" (${size}) to your bag!`, 'success');
    }
  };

  const updateQuantity = (variantKey, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(variantKey);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.variantKey === variantKey) {
        if (qty > item.stock) {
          if (showToast) showToast(`Maximum stock limit is ${item.stock} for this item.`, 'error');
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const removeFromCart = (variantKey) => {
    setCart(prev => prev.filter(item => item.variantKey !== variantKey));
    if (showToast) showToast('Item removed from bag.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 999 || subtotal === 0 ? 0 : 70;
  const freeShippingThreshold = 999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      subtotal,
      deliveryFee,
      total,
      amountToFreeShipping,
      drawerOpen,
      setDrawerOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
