import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicEnvironment } from "@/lib/supabase/env";

export async function createClient() {
  const cookieStore = await cookies();

  const { url, publishableKey } =
    getSupabasePublicEnvironment();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /*
           * Server Components may not write cookies directly.
           * Auth session refreshing will be added later.
           */
        }
      },
    },
  });
}
