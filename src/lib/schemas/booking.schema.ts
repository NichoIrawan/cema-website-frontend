import { z } from "zod";

// ============================================================
// SERVICE SCHEMAS
// ============================================================

export const ServiceItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
  category: z.string().optional(),
  price: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  isPopular: z.boolean().optional(),
  isShown: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ServiceItem = z.infer<typeof ServiceItemSchema>;

export const ServicesResponseSchema = z.object({
  status: z.literal("ok"),
  data: z.array(ServiceItemSchema),
});

// ============================================================
// AUTH SCHEMAS
// ============================================================

export const LoginPayloadSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;

export const RegisterPayloadSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["client", "admin"]).default("client"),
});

export type RegisterPayload = z.infer<typeof RegisterPayloadSchema>;

export const AuthResponseSchema = z.object({
  status: z.literal("success"),
  data: z.object({
    user: z.object({
      _id: z.string(),
      name: z.string(),
      email: z.email(),
      role: z.string(),
    }),
    token: z.string(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ============================================================
// BOOKING SCHEMAS
// ============================================================

// Input schema for form data (client-side)
export const BookingFormDataSchema = z.object({
  serviceId: z.string().min(1, "Pilih layanan"),
  serviceTitle: z.string(),
  servicePrice: z.string().optional(),
  projectDescription: z.string().min(10, "Deskripsi minimal 10 karakter"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Format waktu tidak valid"),
  method: z.enum(["online", "offline"]),
  clientName: z.string().min(2, "Nama minimal 2 karakter"),
  clientPhone: z.string().min(10, "Nomor telepon minimal 10 digit"),
});

export type BookingFormData = z.infer<typeof BookingFormDataSchema>;

// Payload schema for API request (matches backend polymorphic structure)
export const BookingPayloadSchema = z.object({
  booking_type: z.literal("NEW"),
  serviceType: z.string(), // Service ID
  clientName: z.string(),
  projectDescription: z.string(),
  date: z.string(), // ISO date string YYYY-MM-DD
  time: z.string(), // HH:mm format
  event: z.string().optional().default("Consultation"),
  isOnline: z.boolean(),
});

export type BookingPayload = z.infer<typeof BookingPayloadSchema>;

export const BookingResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string().optional(),
  data: z.object({
    schedule: z.object({
      _id: z.string(),
      event: z.string(),
      date: z.string(),
      time: z.string(),
      isOnline: z.boolean(),
    }),
    project: z.object({
      _id: z.string(),
      name: z.string(),
    }).optional(),
  }),
});

export type BookingResponse = z.infer<typeof BookingResponseSchema>;

// ============================================================
// ADAPTER FUNCTIONS
// ============================================================

/**
 * Transforms form data to API payload
 */
export function toBookingPayload(formData: BookingFormData): BookingPayload {
  return {
    booking_type: "NEW",
    serviceType: formData.serviceId,
    clientName: formData.clientName,
    projectDescription: formData.projectDescription,
    date: formData.date,
    time: formData.time,
    event: "Consultation",
    isOnline: formData.method === "online",
  };
}
