"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import { type CartProductType } from "@/src/types";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

interface CartContextType {
  cartTotalQuantity: number;
  cartTotalPrice: number;
  cartProducts: CartProductType[] | null;
  isCheckoutLoading: boolean;
  setIsCheckoutLoading: (value: boolean) => void;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (itemSelected: CartProductType) => void;
  handleClearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}
export const CartContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [cartTotalQuantity, setcartTotalQuantity] = useState(0);
  const [cartTotalPrice, setCartTotalPrice] = useState<number>(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | []>([]);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      axios
        .get("/api/cart")
        .then((response) => {
          setCartProducts(response.data);
        })
        .catch((error) => {
          console.log(error.response?.data?.error || "Error fetching cart");
          if (error.response?.status === 401) {
            setCartProducts([]);
          }
        });
    } else {
      setCartProducts([]);
    }
  }, [status]);

  useEffect(() => {
    const getTotals = (): void => {
      const totalPrice = cartProducts.reduce((akumulator, elemen) => {
        return akumulator + elemen.price;
      }, 0);
      const totalItems = cartProducts.length;
      setcartTotalQuantity(totalItems);
      setCartTotalPrice(totalPrice);
    };
    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback((product: CartProductType) => {
    setCartProducts((prev) => {
      let updatedCart;
      if (prev !== null) {
        updatedCart = [...prev, product];
      } else {
        updatedCart = [product];
      }
      axios
        .post("/api/cart", product)
        .then(() => toast.success("Produk ditambahkan ke keranjang"));
      return updatedCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (itemSelected: CartProductType) => {
      axios
        .delete(`/api/cart/${itemSelected.id}`)
        .then(() => {
          if (cartProducts !== null) {
            const filterProduct = cartProducts.filter((product) => {
              return product.id !== itemSelected.id;
            });
            setCartProducts(filterProduct);
            setcartTotalQuantity(cartTotalQuantity - 1);
          }
          toast.success("Produk dihapus dari keranjang");
        })
        .catch((error) => {
          toast.error("Failed to delete product");
          console.log(error);
        });
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    axios.delete("/api/cart").then(() => {
      setCartProducts([]);
      setcartTotalQuantity(0);
    });
  }, []);

  const value = {
    cartTotalPrice,
    cartTotalQuantity,
    cartProducts,
    isCheckoutLoading,
    setIsCheckoutLoading,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleClearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};
