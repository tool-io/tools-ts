import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UrlInput = { readonly url: string };
export type UrlOutput = {
  readonly fragment: string;
  readonly host: string;
  readonly pathname: string;
  readonly port: string;
  readonly protocol: string;
  readonly query: string;
};

const ABSOLUTE_URL =
  /^([a-zA-Z][a-zA-Z0-9+.\-]*):\/\/([^/?#]+)(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;

export const calculateUrl = (input: UrlInput): UrlOutput => {
  const match = ABSOLUTE_URL.exec(input.url);
  if (!match)
    return simpleError(
      "url",
      "Enter an absolute hierarchical URL with a non-empty host.",
      "malformed_url",
    );
  const protocol = `${match[1]}:`;
  let authority = match[2];
  const at = authority.lastIndexOf("@");
  if (at >= 0) authority = authority.slice(at + 1);
  if (authority.length === 0 || /\s/.test(authority))
    return simpleError("url", "URL host is invalid.", "malformed_url");

  let host = authority;
  let port = "";
  if (authority.startsWith("[")) {
    const ipv6 = /^(\[[0-9a-fA-F:.]+\])(?::(\d+))?$/.exec(authority);
    if (!ipv6)
      return simpleError(
        "url",
        "Bracketed IPv6 host is invalid.",
        "malformed_url",
      );
    host = ipv6[1];
    port = ipv6[2] ?? "";
  } else {
    const colon = authority.lastIndexOf(":");
    if (colon >= 0) {
      if (authority.indexOf(":") !== colon)
        return simpleError(
          "url",
          "IPv6 hosts must use square brackets.",
          "malformed_url",
        );
      host = authority.slice(0, colon);
      port = authority.slice(colon + 1);
    }
    if (host.length === 0 || !/^(?:[a-zA-Z0-9\-._~%!$&'()*+,;=]+)$/.test(host))
      return simpleError("url", "URL host is invalid.", "malformed_url");
  }
  if (port !== "") {
    if (!/^\d+$/.test(port) || Number(port) > 65535)
      return simpleError(
        "url",
        "URL port must be an integer from 0 to 65535.",
        "malformed_url",
      );
  }
  return {
    fragment: match[5] ?? "",
    host,
    pathname: match[3] ?? "/",
    port,
    protocol,
    query: match[4] ?? "",
  };
};

export const urlExample = {
  input: { url: "https://example.com:8443/a/b?q=1&x=2#section" },
  output: {
    fragment: "section",
    host: "example.com",
    pathname: "/a/b",
    port: "8443",
    protocol: "https:",
    query: "q=1&x=2",
  },
} satisfies ToolExample<UrlInput, UrlOutput>;

export const urlTool = createSimpleTool({
  calculate: (input) => calculateUrl({ url: input.url as string }),
  description:
    "Split an absolute hierarchical URL into protocol, host, port, path, query, and fragment components. Bracketed IPv6 hosts and user-info prefixes are supported.",
  id: "parse/url",
  inputs: [
    {
      description: "Absolute URL to parse.",
      id: "url",
      kind: "string",
      label: "URL",
    },
  ],
  outputs: [
    {
      description: "Protocol including the trailing colon.",
      id: "protocol",
      kind: "string",
      label: "Protocol",
    },
    {
      description:
        "Host name or bracketed IPv6 address, excluding user info and port.",
      id: "host",
      kind: "string",
      label: "Host",
    },
    {
      description: "Port as a string, empty when absent.",
      id: "port",
      kind: "string",
      label: "Port",
    },
    {
      description: "Path beginning with a slash.",
      id: "pathname",
      kind: "string",
      label: "Path",
    },
    {
      description: "Query string without the leading question mark.",
      id: "query",
      kind: "string",
      label: "Query",
    },
    {
      description: "Fragment identifier without the leading hash.",
      id: "fragment",
      kind: "string",
      label: "Fragment",
    },
  ],
  title: "URL Parser",
});

export const runUrl = urlTool.execute;
export default urlTool;
