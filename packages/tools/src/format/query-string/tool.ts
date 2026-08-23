import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type QueryStringInput = {
  readonly params?: Record<string, unknown>;
};

export type QueryStringOutput = {
  readonly queryString: string;
};

export const calculateQueryString = (
  input: QueryStringInput,
): QueryStringOutput => {
  const entries = input.params ?? { search: "red shoes", page: "2" };
  return {
    queryString: Object.entries(entries)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join("&"),
  };
};

export const queryStringExample = {
  input: {
    params: {
      search: "red shoes",
      page: "2",
    },
  },
  output: {
    queryString: "search=red%20shoes&page=2",
  },
} satisfies ToolExample<QueryStringInput, QueryStringOutput>;

export const queryStringTool = createSimpleTool({
  id: "format/query-string",
  title: "Query String Formatter",
  description:
    "Serialize an object into a URL-encoded query string with percent-encoded keys and values.",
  inputs: [
    {
      description: "Parameter object; values are coerced to strings.",
      default: { search: "red shoes", page: "2" },
      id: "params",
      kind: "object",
      label: "Params",
    },
  ],
  outputs: [
    {
      description: "Encoded query string without the leading question mark.",
      id: "queryString",
      kind: "string",
      label: "Query string",
    },
  ],
  calculate: (input) =>
    calculateQueryString({
      params: input.params as Record<string, unknown> | undefined,
    }),
});

export const runQueryString = queryStringTool.execute;
export default queryStringTool;
