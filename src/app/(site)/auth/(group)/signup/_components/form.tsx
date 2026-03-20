import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup } from "@/components/ui/input-group";
import { passwordValidation } from "@/utils/validations";
import { integrations, messages } from "@integrations-config";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

type Input = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  privacyPolicy: boolean;
};

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<Input>();

  const passwordValue = watch("password");

  async function onSubmit({ privacyPolicy, confirmPassword, ...payload }: Input) {
    if (!integrations?.isAuthEnabled) {
      toast.error(messages?.auth);
      return;
    }

    try {
      await axios.post("/api/register", {
        ...payload,
        name: payload.fullName,
      });

      toast.success("Sikeres regisztráció!");
      reset();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-5">
        <InputGroup
          label="Teljes név"
          placeholder="Keresztnév és vezetéknév"
          required
          {...register("fullName", { required: "Teljes név megadása kötelező" })}
          errorMessages={errors.fullName?.message}
        />
      </div>

      <div className="mb-5">
        <InputGroup
          type="email"
          label="Munkahelyi email"
          placeholder="Add meg az email címed"
          required
          {...register("email", {
            required: "Email megadása kötelező",
            validate: (value) => value.includes("@") || "Érvénytelen email cím",
          })}
          errorMessages={errors.email?.message}
        />
      </div>

      <div className="mb-6">
        <fieldset>
          <label htmlFor="signup-password" className="mb-2.5 inline-block text-sm">
            Jelszó
          </label>
          <div className="relative">
            <InputGroup
              id="signup-password"
              type={showPassword ? "text" : "password"}
              label=""
              placeholder="Add meg a jelszavad"
              required
              {...register("password", {
                required: "Jelszó megadása kötelező",
                validate: (value) =>
                  passwordValidation(value) ||
                  "A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt, egy számot és egy speciális karaktert",
              })}
              errorMessages={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-body absolute top-1/2 right-4 -translate-y-1/2"
              aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M10.58 10.58C10.2075 10.9525 10 11.4603 10 12C10 13.1046 10.8954 14 12 14C12.5397 14 13.0475 13.7925 13.42 13.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M16.68 16.67C15.28 17.56 13.68 18 12 18C8 18 4.73 15.61 3 12C3.53 10.89 4.29 9.9 5.22 9.09M9.88 5.08C10.57 4.94 11.28 4.87 12 4.87C16 4.87 19.27 7.26 21 10.87C20.48 11.95 19.76 12.92 18.88 13.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12C4.73 8.39 8 6 12 6C16 6 19.27 8.39 21 12C19.27 15.61 16 18 12 18C8 18 4.73 15.61 3 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </button>
          </div>
        </fieldset>
      </div>

      <div className="mb-6">
        <fieldset>
          <label htmlFor="signup-confirm-password" className="mb-2.5 inline-block text-sm">
            Jelszó megerősítése
          </label>
          <div className="relative">
            <InputGroup
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              label=""
              placeholder="Írd be újra a jelszavad"
              required
              {...register("confirmPassword", {
                required: "A jelszó megerősítése kötelező",
                validate: (value) => value === passwordValue || "A két jelszó nem egyezik",
              })}
              errorMessages={errors.confirmPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-body absolute top-1/2 right-4 -translate-y-1/2"
              aria-label={showConfirmPassword ? "Megerősítő jelszó elrejtése" : "Megerősítő jelszó megjelenítése"}
            >
              {showConfirmPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M10.58 10.58C10.2075 10.9525 10 11.4603 10 12C10 13.1046 10.8954 14 12 14C12.5397 14 13.0475 13.7925 13.42 13.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M16.68 16.67C15.28 17.56 13.68 18 12 18C8 18 4.73 15.61 3 12C3.53 10.89 4.29 9.9 5.22 9.09M9.88 5.08C10.57 4.94 11.28 4.87 12 4.87C16 4.87 19.27 7.26 21 10.87C20.48 11.95 19.76 12.92 18.88 13.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12C4.73 8.39 8 6 12 6C16 6 19.27 8.39 21 12C19.27 15.61 16 18 12 18C8 18 4.73 15.61 3 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              )}
            </button>
          </div>
        </fieldset>
      </div>

      <div className="mb-[30px]">
        <Controller
          control={control}
          name="privacyPolicy"
          rules={{ required: "El kell fogadnod a felhasználási feltételeket" }}
          render={({ field, fieldState }) => (
            <>
              <Checkbox
                name={field.name}
                onChange={(e) => field.onChange(e.target.checked)}
                defaultChecked={field.value}
                label={
                  <>
                    A fiók létrehozásával elfogadod a{" "}
                    <Link
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Felhasználási feltételek
                    </Link>
                    , és a mi{" "}
                    <Link
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Adatvédelmi irányelveinket
                    </Link>
                  </>
                }
              />
              {fieldState.error && (
                <p className="mt-2 text-sm text-red-500">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <button className="bg-primary hover:bg-primary/90 flex w-full justify-center rounded-md p-3 text-base font-medium text-white">
        Regisztráció
      </button>
    </form>
  );
}
