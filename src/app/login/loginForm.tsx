// /* eslint-disable @typescript-eslint/no-misused-promises */
// /* eslint-disable react/react-in-jsx-scope */
// /* eslint-disable react/prop-types */
// "use client";

// import React, { useState } from "react";
// import CustomButton from "@/src/components/CustomButton";
// import Heading from "@/src/components/Heading";
// import Input from "@/src/components/Inputs/input";
// import { type SignInResponse, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
// import { FcGoogle } from "react-icons/fc";
// import toast from "react-hot-toast";
// import Navigation from "@/src/components/Navigation/navigation";

// const LoginForm: React.FC = () => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FieldValues>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit: SubmitHandler<FieldValues> = async (userCredentials) => {
//     setIsLoading(true);
//     try {
//       const signInProcess = async (
//         credentials: FieldValues
//       ): Promise<SignInResponse | undefined> => {
//         return await signIn("credentials", {
//           ...credentials,
//           redirect: false,
//         });
//       };
//       const signInPromise = await signInProcess(userCredentials);
//       if (signInPromise?.ok === true) {
//         router.push("/");
//         router.refresh();
//         toast.success("Logged In");
//       }
//       if (signInPromise?.error != null) {
//         toast.error(signInPromise.error);
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Heading
//         title="Welcome To Bodat Chic"
//         serif
//         className={"pb-2 text-3xl"}
//       />

//       <Input
//         id="email"
//         label="Email"
//         disabled={isLoading}
//         register={register}
//         errors={errors}
//         required
//         type="email"
//       />
//       <Input
//         id="password"
//         label="Password"
//         disabled={isLoading}
//         register={register}
//         errors={errors}
//         required
//         type="password"
//       />
//       <CustomButton
//         label={isLoading ? "Loading..." : "Login"}
//         onClick={handleSubmit(onSubmit)}
//         disabled={isLoading}
//       />

//       <CustomButton
//         outline
//         label="Google"
//         icon={FcGoogle}
//         onClick={() => {
//           void signIn("google");
//         }}
//         disabled={isLoading}
//       />
//       <Navigation
//         isLoading={isLoading}
//         path={"/register"}
//         text={"don't have an account yet"}
//       >
//         <span className="bg-gradient-to-b from-blue-800 to-rose-500 text-transparent bg-clip-text ml-2">
//           register
//         </span>
//       </Navigation>
//     </>
//   );
// };

// export default LoginForm;

"use client";

import React, { useState } from "react";
import CustomButton from "@/src/components/CustomButton";
import Heading from "@/src/components/Heading";
import Input from "@/src/components/Inputs/input";
import Navigation from "@/src/components/Navigation/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type FieldValues, type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useAuthModal } from "@/src/hooks/useAuthModal";

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authModal = useAuthModal(); // <-- GUNAKAN HOOK

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    // Hilangkan 'name' dari defaultValues
    defaultValues: { email: "", password: "" },
  });

  const googleSignInProcess = async () => {
    await signIn("google");
  };

  // Logika onSubmit disederhanakan untuk login
  const onSubmit: SubmitHandler<FieldValues> = async (userCredentials) => {
    setIsLoading(true);
    try {
      const signInResolve = await signIn("credentials", {
        ...userCredentials,
        redirect: false,
      });

      if (signInResolve?.ok === true) {
        router.push("/");
        router.refresh();
        toast.success("Logged In");
        authModal.onClose(); // <-- TUTUP MODAL SETELAH SUKSES
      }

      if (signInResolve?.error != null) {
        toast.error(signInResolve.error);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="Welcome Back!" serif className={"pb-2 text-3xl"} />
      <p className="text-neutral-500 text-sm mb-4">Log in to your account.</p>

      <div className="flex flex-col gap-4 mt-4">
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="email"
        />
        <Input
          id="password"
          label="Password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type="password"
        />
        <CustomButton
          label={isLoading ? "Loading..." : "Log In"} // Ganti label tombol
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading}
        />

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <CustomButton
          outline
          label="Continue with Google"
          icon={FcGoogle}
          onClick={() => {
            googleSignInProcess();
          }}
          disabled={isLoading}
        />
      </div>
      {/* MODIFIKASI NAVIGASI */}
      <div className="text-center mt-4">
        <span className="text-neutral-500">Don't have an account?</span>
        <span
          onClick={authModal.toggleView} // <-- Ganti ke Register
          className="bg-gradient-to-b from-blue-800 to-rose-500 text-transparent bg-clip-text ml-2 cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </div>
    </>
  );
};

export default LoginForm;
