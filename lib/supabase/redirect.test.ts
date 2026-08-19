import assert from "node:assert/strict";
import test from "node:test";

import { getAuthRedirectUrl } from "./redirect";

test("prefers configured site url over request headers", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";

  try {
    assert.equal(
      getAuthRedirectUrl(new Headers({ host: "wrong.example.com" })),
      "https://example.com/auth/confirm",
    );
  } finally {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  }
});

test("uses forwarded host and protocol when site url is absent", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;

  try {
    assert.equal(
      getAuthRedirectUrl(
        new Headers({
          "x-forwarded-proto": "https",
          "x-forwarded-host": "app.example.com",
        }),
      ),
      "https://app.example.com/auth/confirm",
    );
  } finally {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  }
});

test("handles comma separated forwarded values", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_SITE_URL;

  try {
    assert.equal(
      getAuthRedirectUrl(
        new Headers({
          "x-forwarded-proto": "https,http",
          "x-forwarded-host": "app.example.com, proxy.internal",
        }),
      ),
      "https://app.example.com/auth/confirm",
    );
  } finally {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  }
});
