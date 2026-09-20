import { parseUrl, type PortableUrl } from "../core/url.js";
import { simpleError } from "../core/simple.js";
import type { ToolResult } from "../core/result.js";

/** Caller URL validation; constructed parser failures remain programming errors. */
export const httpUrl = (
  value: string,
  field: string,
  base?: string,
): PortableUrl => {
  let url: PortableUrl;
  try {
    url = parseUrl(value, base);
  } catch (error) {
    if (error instanceof TypeError)
      return simpleError(
        field,
        "Provide a supported HTTP(S) URL.",
        "invalid_url",
      );
    throw error;
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username !== "" ||
    url.password !== ""
  )
    return simpleError(
      field,
      "Use HTTP(S) without credentials.",
      "invalid_url",
    );
  return url;
};
export const coreOutput = <T>(result: ToolResult<T>): T => {
  if (!result.ok)
    throw new Error(
      "A constructed supported fixture was rejected by its calculation core.",
    );
  return result.output;
};
export const encode = (value: string, field = "values"): string => {
  try {
    return encodeURIComponent(value);
  } catch (error) {
    if (error instanceof URIError)
      return simpleError(
        field,
        "Use well-formed Unicode strings.",
        "invalid_unicode",
      );
    throw error;
  }
};
export const token = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+(?![\s\S])/u;
