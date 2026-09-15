// Supabase auth error messages are technical/inconsistent; map the common
// ones to copy a non-technical user can act on, and fall back to the raw
// message for anything else rather than hiding it.
export function friendlyAuthError(message: string): string {
    const normalized = message.toLowerCase();

    if (normalized.includes("invalid login credentials")) {
        return "That email or password doesn't match our records. Please try again.";
    }
    if (normalized.includes("email not confirmed")) {
        return "Please confirm your email first — check your inbox for the confirmation link.";
    }
    if (normalized.includes("user already registered") || normalized.includes("already registered")) {
        return "An account with this email already exists. Try logging in instead.";
    }
    if (normalized.includes("rate limit")) {
        return "Too many attempts — please wait a few minutes and try again.";
    }
    if (normalized.includes("network") || normalized.includes("fetch")) {
        return "Couldn't reach the server. Check your connection and try again.";
    }

    return message;
}
