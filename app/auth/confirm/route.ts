import {
  type EmailOtpType,
} from "@supabase/supabase-js";

import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
  const url = new URL(request.url);

  const tokenHash =
    url.searchParams.get("token_hash");

  const type =
    url.searchParams.get("type");

  const code =
    url.searchParams.get("code");

  const token =
    url.searchParams.get("token");

  const email =
    url.searchParams.get("email");

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } =
      await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash: tokenHash,
      });

    if (!error) {
      return NextResponse.redirect(
        new URL("/", request.url),
      );
    }
  }

  if (token && type && email) {
    const { error } =
      await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token,
        email,
      });

    if (!error) {
      return NextResponse.redirect(
        new URL("/", request.url),
      );
    }
  }

  if (code) {
    const { error } =
      await supabase.auth.exchangeCodeForSession(
        code,
      );

    if (!error) {
      return NextResponse.redirect(
        new URL("/", request.url),
      );
    }
  }

  return NextResponse.redirect(
    new URL(
      "/auth/auth-code-error",
      request.url,
    ),
  );
}
