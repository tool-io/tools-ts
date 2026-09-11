export * from "../construction/batch50-shared.js";
import { parseUrl, type PortableUrl } from "../core/url.js";
import { simpleError, unique } from "../construction/batch50-shared.js";
export const absoluteUrl = (s: string): PortableUrl => {
  try {
    return parseUrl(s);
  } catch {
    return simpleError("url", "Actual absolute URL required.");
  }
};
export const domainParts = (
  s: string,
  suffixes: readonly string[],
): {
  domain: string;
  subdomain: string;
  suffix: string;
  available: boolean;
} => {
  unique(suffixes, "suffixes");
  if (
    suffixes.some(
      (v) =>
        v !== v.toLowerCase() ||
        !/^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)(\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/.test(
          v,
        ),
    )
  )
    simpleError(
      "suffixes",
      "Independently verified lower case exact expanded ASCII suffixes, not wild cards/exceptions.",
    );
  const h = absoluteUrl(s).hostname.replace(/\.$/, "");
  if (!h || h.startsWith("[") || /^[0-9.]+$/.test(h))
    simpleError("host", "DNShostnamebranch,noIPliteral.");
  const suffix =
    [...suffixes]
      .filter((v) => h === v || h.endsWith("." + v))
      .sort((a, b) => b.length - a.length)[0] ?? "";
  if (!suffix || h === suffix)
    return { domain: "", subdomain: "", suffix, available: false };
  const head = h.slice(0, -suffix.length - 1).split("."),
    label = head.pop()!;
  return {
    domain: label + "." + suffix,
    subdomain: head.join("."),
    suffix,
    available: true,
  };
};
export const parseHttpTokens = (s: string): string[] => {
  if (!s.trim()) return [];
  const a = s.split(",").map((v) => v.trim().toLowerCase());
  if (a.some((v) => !/^[-!#$%&'*+.^_`|~0-9a-z]+$/.test(v)))
    simpleError(
      "header",
      "Actual comma-separated HTTP token list, no empty tokens/parameters/line breaks.",
    );
  return a;
};
