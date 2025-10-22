import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be less than 72 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required")
});

export const tripRegistrationSchema = z.object({
  origin: z.string().trim().min(1, "Origin is required").max(200, "Origin must be less than 200 characters"),
  destination: z.string().trim().min(1, "Destination is required").max(200, "Destination must be less than 200 characters"),
  state: z.string().trim().min(1, "State is required").max(100),
  district: z.string().trim().max(100).optional(),
  vehicleType: z.enum(["car", "bus", "truck", "bike", "auto"], {
    errorMap: () => ({ message: "Please select a valid vehicle type" })
  }),
  travelDate: z.string().min(1, "Travel date is required")
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type TripRegistrationFormData = z.infer<typeof tripRegistrationSchema>;
