import { ZodIssue } from "zod";

// DTO used to represent response from the server actions
type ActionResult<T> = 
  { status: "success", data: T } | { status: "error", error: string | ZodIssue[] }