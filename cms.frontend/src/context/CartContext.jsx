import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.selectedSize === product.selectedSize);
            const qToApp = product.quantity || 1;
            if (existing) {
                return prev.map(item => item.cartItemId === existing.cartItemId ? { ...item, quantity: item.quantity + qToApp } : item);
            }
            return [...prev, { ...product, quantity: qToApp, cartItemId: Date.now().toString() + Math.random().toString() }];
        });
    };

    const updateQuantity = (cartItemId, amount) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.cartItemId === cartItemId) {
                    const newQ = item.quantity + amount;
                    return { ...item, quantity: newQ > 0 ? newQ : 1 };
                }
                return item;
            });
        });
    };

    const removeFromCart = (cartItemId) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
