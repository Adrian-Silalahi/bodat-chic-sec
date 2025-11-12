// src/components/auth/AuthModal.tsx
"use client";

import React from "react";
import Modal from "@/src/components/Modal";
import { useAuthModal } from "@/src/hooks/useAuthModal";
import LoginForm from "@/src/app/login/loginForm";
import RegisterForm from "@/src/app/register/registerForm";

const AuthModal = () => {
  // Ambil state dari Context kita
  const { isOpen, onClose, view } = useAuthModal();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Tampilkan form yang sesuai */}
      {view === "login" ? <LoginForm /> : <RegisterForm />}
    </Modal>
  );
};

export default AuthModal;
