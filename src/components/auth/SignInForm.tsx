"use client";
import axios from "@/axios";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useUserStore } from "@/context/UserContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignInForm() {
  const userStore:any = useUserStore();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
      userStore.setUser(null);
      localStorage.removeItem("token");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/admin/login", {
        email: credential,
        password,
      });
      
      const { data } = response.data;
      if (data && data.token && data.user) {
        localStorage.setItem("token", data.token);
        userStore.setUser(data.user);
        router.push("/");
      } else {
        alert("Giriş başarısız!");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Hatalı kullanıcı bilgileri!";
      alert(errorMessage);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Giriş Yap
            </h1>
          </div>
          <div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    E-Posta <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    onChange={(e: any) => setCredential(e.target.value)}
                    value={credential}
                    placeholder="info@gmail.com"
                    type="email" />
                </div>
                <div>
                  <Label>
                    Parola <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      onChange={(e: any) => setPassword(e.target.value)}
                      value={password}
                      type={showPassword ? "text" : "password"}
                      placeholder="Parolanızı giriniz"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Giriş Yap
                  </Button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
