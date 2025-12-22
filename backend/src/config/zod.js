import { z } from "zod";

// Regex coherentes con tu frontend
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,16}$/; // 8-16 chars, upper/lower/número/símbolo
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // estándar de emails

// ==============================
// SCHEMA SIGN UP
// ==============================
export const signUpSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .email({ message: "Invalid email." })
    .regex(emailRegex, { message: "Invalid email." }),

  password: z.string({ required_error: "Password is required" })
    .regex(passwordRegex, {
      message: "Password must be 8-16 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%)."
    })
});

// ==============================
// SCHEMA SIGN IN
// ==============================
export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .email({ message: "Invalid email." })
    .regex(emailRegex, { message: "Invalid email." }),

  password: z.string({ required_error: "Password is required" })
    .regex(passwordRegex, {
      message: "Invalid password. Must be 8-16 characters, include uppercase, lowercase, number and special character (!@#$%)."
    })
});
