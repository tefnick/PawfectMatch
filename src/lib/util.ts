import { differenceInYears } from "date-fns";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

export function calculateAge(birthdate: Date) {
  return differenceInYears(new Date(), birthdate); // `new Date()` evaluates to today's date
}

export function handleFormServerErrors<TFieldValues extends FieldValues>(
  errorResponse: {error: string | ZodIssue[]},
  setError: UseFormSetError<TFieldValues>
) {
  if (Array.isArray(errorResponse.error)) { // is errors is an array, it means it's a ZodIssue[]
    errorResponse.error.forEach((error) => {
      const fieldName = error.path.join('.') as Path<TFieldValues>;
      setError(fieldName, {message: error.message})
    })
  } else {
    setError('root.serverError', { message: errorResponse.error})
  }
}