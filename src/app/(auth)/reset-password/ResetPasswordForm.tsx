"use client";

import React, { useState } from "react";
import { ActionResult } from "@/types";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import { GiPadlock } from "react-icons/gi";
import { Button, Input } from "@nextui-org/react";
import ResultMessage from "@/components/ResultMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/lib/schemas/forgotPasswordSchema";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ActionResult<string> | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordSchema>({
    mode: "onTouched",
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setResult(await resetPassword(data.password, searchParams.get("token")));
    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Reset password"
      subHeaderText="Enter your new password below"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <Input
            type="password"
            placeholder="Password"
            variant="bordered"
            defaultValue=""
            {...register("password")}
            isInvalid={!!errors?.password}
            errorMessage={errors.password?.message as string}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            variant="bordered"
            defaultValue=""
            {...register("confirmPassword")}
            isInvalid={!!errors?.confirmPassword}
            errorMessage={errors.confirmPassword?.message as string}
          />
          <Button
            type="submit"
            color="secondary"
            isLoading={isSubmitting}
            isDisabled={!isValid}
          >
            Reset Password
          </Button>
        </form>
      }
      footer={<ResultMessage result={result} />}
    />
  );
}
