import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UrlInput = {
  readonly scheme?: string;
  readonly host: string;
  readonly port?: number;
  readonly pathname?: string;
  readonly query?: string;
  readonly fragment?: string;
};

export type UrlOutput = {
  readonly url: string;
};

export const calculateUrl = (input: UrlInput): UrlOutput => {
  const scheme = input.scheme ?? "https";
  const host = input.host ?? "";
  const pathname = input.pathname ?? "/";
  if (host.trim().length === 0)
    simpleError("host", "Host is required.", "missing_host");
  if (scheme.trim().length === 0)
    simpleError("scheme", "Scheme is required.", "missing_scheme");
  const pathPart =
    pathname.length === 0
      ? "/"
      : pathname.startsWith("/")
        ? pathname
        : "/" + pathname;
  const portPart = input.port === undefined ? "" : ":" + String(input.port);
  const queryPart =
    input.query === undefined || input.query.length === 0
      ? ""
      : "?" + input.query;
  const fragmentPart =
    input.fragment === undefined || input.fragment.length === 0
      ? ""
      : "#" + input.fragment;
  return {
    url: scheme + "://" + host + portPart + pathPart + queryPart + fragmentPart,
  };
};

export const urlExample = {
  input: {
    scheme: "https",
    host: "example.com",
    port: 8443,
    pathname: "api/v1",
    query: "q=tool&sort=asc",
    fragment: "results",
  },
  output: {
    url: "https://example.com:8443/api/v1?q=tool&sort=asc#results",
  },
} satisfies ToolExample<UrlInput, UrlOutput>;

export const urlTool = createSimpleTool({
  id: "format/url",
  title: "URL Formatter",
  description:
    "Assemble an absolute URL from its scheme, host, optional port, path, query and fragment parts.",
  inputs: [
    {
      description: "URL scheme such as https.",
      default: "https",
      id: "scheme",
      kind: "string",
      label: "Scheme",
    },
    {
      description: "Host name or IP address.",
      id: "host",
      kind: "string",
      label: "Host",
    },
    {
      description: "Optional port between 1 and 65535.",
      id: "port",
      kind: "integer",
      label: "Port",
      minimum: 1,
      maximum: 65535,
    },
    {
      description: "Path beginning with a slash.",
      default: "/",
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
  outputs: [
    {
      description: "Formatted absolute URL.",
      id: "url",
      kind: "string",
      label: "URL",
    },
  ],
  calculate: (input) =>
    calculateUrl({
      fragment: input.fragment as string | undefined,
      host: input.host as string,
      pathname: input.pathname as string | undefined,
      port: input.port as number | undefined,
      query: input.query as string | undefined,
      scheme: input.scheme as string | undefined,
    }),
});

export const runUrl = urlTool.execute;
export default urlTool;
