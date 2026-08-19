function getFirstHeaderValue(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.split(",")[0]?.trim();
  return normalized || null;
}

export function getAuthRedirectUrl(
  headerStore?: Headers,
): string {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return `${configuredSiteUrl.replace(/\/$/, "")}/auth/confirm`;
  }

  if (!headerStore) {
    return "http://localhost:3000/auth/confirm";
  }

  const forwardedHost = getFirstHeaderValue(
    headerStore.get("x-forwarded-host") ??
      headerStore.get("host"),
  );

  const forwardedProtocol = getFirstHeaderValue(
    headerStore.get("x-forwarded-proto") ?? "http",
  );

  if (forwardedHost) {
    return `${forwardedProtocol ?? "https"}://${forwardedHost}/auth/confirm`;
  }

  return "http://localhost:3000/auth/confirm";
}
