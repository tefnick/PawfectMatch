"use client";

import { FormProvider, useForm } from "react-hook-form";
import { profileSchema, ProfileSchema } from "@/lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CardWrapper from "@/components/CardWrapper";
import { Button } from "@nextui-org/react";
import React from "react";
import ProfileForm from "@/app/(auth)/register/ProfileForm";
import { FaPaw } from "react-icons/fa";
import { completeSocialLoginProfile } from "@/app/actions/authActions";
import { signIn } from "next-auth/react";

export default function CompleteProfileForm() {
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: ProfileSchema) => {
    const result = await completeSocialLoginProfile(data);

    if (result.status === "success") {
      signIn(result.data, {
        redirectTo: "/dogs",
      });
    }
  };

  return (
    <CardWrapper
      headerText={"About you"}
      subHeaderText={"Please complete your profile to continue to the app"}
      headerIcon={FaPaw}
      body={
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <ProfileForm />
              {errors.root?.serverError && (
                <p className="text-danger text-sm">
                  {errors.root.serverError.message}
                </p>
              )}
              <div className="flex flex-row items-center gap-6">
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  fullWidth
                  color="primary"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      }
    />
  );
}
