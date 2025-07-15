import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Simple rate limiting
const RATE_LIMIT_WINDOW = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 5;

// Rate limiting storage
const clientRateLimits = new Map<string, { count: number; firstRequest: number }>();

export async function GET(request: Request) {
  try {
    // Get client identifier
    const clientId = request.headers.get('x-forwarded-for') || 
                     request.headers.get('user-agent') || 
                     'default-client';
    
    // Basic rate limiting
    const now = Date.now();
    const rateLimit = clientRateLimits.get(clientId) || { count: 0, firstRequest: now };
    
    if (now - rateLimit.firstRequest > RATE_LIMIT_WINDOW) {
      rateLimit.count = 1;
      rateLimit.firstRequest = now;
    } else {
      rateLimit.count += 1;
    }
    
    clientRateLimits.set(clientId, rateLimit);
    
    if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ 
        error: "Rate limit exceeded", 
        rateLimited: true 
      }, { status: 429 });
    }

    // Get session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: "Not authenticated", 
        requiresLogin: true 
      }, { status: 403 }); // Using 403 instead of 401 to prevent auto-logout
    }
    
    if (!session.accessToken) {
      return NextResponse.json({ 
        error: "No access token", 
        requiresLogin: true 
      }, { status: 403 }); // Using 403 instead of 401 to prevent auto-logout
    }
    
    // Fetch user data from API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: "no-store"
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({
          error: "Session expired",
          requiresLogin: true
        }, { status: 403 }); // Using 403 instead of 401 to prevent auto-logout
      }
      
      return NextResponse.json(
        { error: "API error" },
        { status: response.status === 401 ? 403 : response.status }
      );
    }
    
    const userData = await response.json();
    
    const enhancedUser = {
      ...userData,
      id: userData.id || session.user.id,
      email: userData.email || session.user.email,
      name: userData.full_name || userData.name || session.user.name,
      role: userData.role || session.user.role,
      image: userData.image || session.user.image,
    };
    
    return NextResponse.json(enhancedUser);
    
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
