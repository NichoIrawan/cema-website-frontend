import { NextRequest, NextResponse } from "next/server";
import { getBackendToken } from "@/lib/auth-helper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * BFF API Route for Booking
 * Handles POST /api/booking
 * 
 * This route receives booking data from the client,
 * attaches the auth token from the httpOnly cookie,
 * and forwards the request to the backend.
 */
export async function POST(request: NextRequest) {
  try {
    // Get the auth token from the cookie
    const token = await getBackendToken();

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: Please login first" },
        { status: 401 }
      );
    }

    // Get the booking payload from the request body
    const payload = await request.json();

    // Forward to backend API
    const response = await fetch(`${API_URL}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: data.message || "Failed to create booking" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [BFF] Booking API Error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
