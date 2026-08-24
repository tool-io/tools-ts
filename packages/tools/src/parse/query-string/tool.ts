import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QueryStringInput = {
  readonly queryString?: string;
};

export type QueryStringOutput = {
  readonly params: Record<string, unknown>;
};

export const calculateQueryString = (
  input: QueryStringInput,
): QueryStringOutput => {
  const source = input.queryString ?? "q=red+shoes&page=2";
  const params: Record<string, unknown> = {};
  try {
    for (const pair of source.split("&")) {
      if (pair === "") continue;
      const separator = pair.indexOf("=");
      const rawKey = (
        separator === -1 ? pair : pair.slice(0, separator)
      ).replace(/\+/g, " ");
      const key = decodeURIComponent(rawKey);
      const rawValue = (
        separator === -1 ? "" : pair.slice(separator + 1)
      ).replace(/\+/g, " ");
      params[key] = decodeURIComponent(rawValue);
    }
  } catch {
    return simpleError(
      "queryString",
      "Query string contains malformed percent-encoding.",
      "invalid_query_string",
    );
  }
  return { params };
};

export const queryStringExample = {
  input: {
    queryString: "q=red+shoes&lang=en&page=2",
  },
  output: {
    params: {
      q: "red shoes",
      lang: "en",
      page: "2",
    },
  },
} satisfies ToolExample<QueryStringInput, QueryStringOutput>;

export const queryStringTool = createSimpleTool({
  id: "parse/query-string",
  title: "Query String Parser",
  description:
    "Parse a URL query string into an object of decoded keys and string values (repeated keys keep the last value).",
  inputs: [
    {
      description: "Query string without the leading question mark.",
      default: "q=red+shoes&page=2",
      id: "queryString",
      kind: "string",
      label: "Query string",
    },
  ],
  outputs: [
    {
      description: "Decoded parameter object.",
      id: "params",
      kind: "object",
      label: "Params",
    },
  ],
  calculate: (input) =>
    calculateQueryString({
      queryString: input.queryString as string,
    }),
});

export const runQueryString = queryStringTool.execute;
export default queryStringTool;
