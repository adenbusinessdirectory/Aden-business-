import HeaderClient from "@/components/HeaderClient";
import {
  getAuthContext,
  roleHome,
} from "@/lib/auth";

export default async function Header() {
  const context = await getAuthContext();

  if (!context) {
    return (
      <HeaderClient
        isAuthenticated={false}
        displayName={null}
        accountHref="/login"
        role={null}
      />
    );
  }

  const metadataName =
    typeof context.user.user_metadata?.full_name ===
    "string"
      ? context.user.user_metadata.full_name.trim()
      : "";

  const displayName =
    context.profile?.full_name?.trim() ||
    metadataName ||
    context.user.email?.split("@")[0] ||
    "حسابي";

  return (
    <HeaderClient
      isAuthenticated
      displayName={displayName}
      accountHref={roleHome(context.role)}
      role={context.role}
    />
  );
}
