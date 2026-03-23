import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY;

// Diagnóstico de key al inicializar (solo en DEV)
// (debug call removed for production)

const instrumentedFetch: typeof fetch = async (input, init) => {
  const requestUrl = typeof input === "string" ? input : input.url;
  const isSupabaseRequest = requestUrl.includes("supabase.co");

  if (!isSupabaseRequest) {
    return fetch(input, init);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  const t0 = performance.now();

  try {
    const headers = new Headers(init?.headers || {});
    headers.set("cache-control", "no-cache");
    headers.set("pragma", "no-cache");

    const response = await fetch(input, {
      ...init,
      headers,
      cache: "no-store",
      signal: controller.signal,
    });

    const ms = Math.round(performance.now() - t0);
    // Logging removed for production

    return response;
  } catch (error: any) {
    const ms = Math.round(performance.now() - t0);
    // Logging removed for production
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    fetch: instrumentedFetch,
  },
});

// Ping de conexión en DEV — removido para producción
