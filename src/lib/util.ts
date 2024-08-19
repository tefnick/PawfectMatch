import { differenceInYears } from "date-fns";

export function calculateAge(birthdate: Date) {
  return differenceInYears(new Date(), birthdate); // `new Date()` evaluates to today's date
}