/**
 * Shared TypeScript type definitions for PT Cipta Maharupa Abadi
 */

// Navigation
export interface NavItem {
    label: string;
    href: string;
}

// User & Authentication
export type UserRole = 'admin' | 'client' | 'guest';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

// Admin Dashboard Tabs
export interface TabConfig {
    id: string;
    label: string;
    content?: React.ReactNode;
}

// Services
export type ServiceType = 'interior' | 'arsitek' | 'renovasi';

export interface Service {
    id: string;
    name: string;
    type: ServiceType;
    description: string;
}

// Projects
export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export interface Project {
    id: string;
    name: string;
    clientName: string;
    status: ProjectStatus;
    serviceType: ServiceType;
    createdAt: Date;
}

// Booking
export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    location: string;
    serviceType: ServiceType;
    consultationDate: Date;
    message?: string;
}

// Calculator
export type MaterialQuality = 'standard' | 'premium';

export interface CalculatorInput {
    area: number; // m²
    materialQuality: MaterialQuality;
}

export interface CalculatorResult {
    totalCost: number;
    breakdown: {
        basePrice: number;
        materialMultiplier: number;
        finalPrice: number;
    };
}
