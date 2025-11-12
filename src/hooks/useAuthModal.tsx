// src/hooks/useAuthModal.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type AuthModalView = "login" | "register";

interface AuthModalContextType {
  isOpen: boolean;
  view: AuthModalView;
  onOpen: (view: AuthModalView) => void;
  onClose: () => void;
  toggleView: () => void;
}

// 1. Buat Context
export const AuthModalContext = createContext<AuthModalContextType | null>(
  null
);

interface ProviderProps {
  children: ReactNode;
}

// 2. Buat Provider
export const AuthModalContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthModalView>("login");

  const onOpen = useCallback((view: AuthModalView) => {
    setIsOpen(true);
    setView(view);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleView = useCallback(() => {
    setView((prev) => (prev === "login" ? "register" : "login"));
  }, []);

  const value = {
    isOpen,
    view,
    onOpen,
    onClose,
    toggleView,
  };

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
};

// 3. Buat Hook (sama seperti useCart)
export const useAuthModal = (): AuthModalContextType => {
  const context = useContext(AuthModalContext);

  if (context === null) {
    throw new Error(
      "useAuthModal must be used within an AuthModalContextProvider"
    );
  }

  return context;
};
