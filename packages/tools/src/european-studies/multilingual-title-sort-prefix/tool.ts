import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly title: string;
  readonly suppliedPrefixes: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = {
  readonly matchedPrefix: string;
  readonly sortKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    suppliedPrefixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["title", "suppliedPrefixes", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchedPrefix: { type: "string", maxLength: 8192 },
    sortKey: { type: "string", maxLength: 8192 },
  },
  required: ["matchedPrefix", "sortKey"],
} as const;
/** Remove the longest literal caller-supplied nonfiling prefix without locale collation or language detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, suppliedPrefixes, caseSensitive } = request;
  const compute = (): Output => {
    const norm = (x: string) => (caseSensitive ? x : x.toLowerCase());
    const matches = suppliedPrefixes
      .filter((x) => x.length > 0 && norm(title).startsWith(norm(x)))
      .sort((a, b) => b.length - a.length);
    const matchedPrefix = matches[0] ?? "";
    return { matchedPrefix, sortKey: title.slice(matchedPrefix.length) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    title: "The Book",
    suppliedPrefixes: ["The ", "Le "],
    caseSensitive: false,
  },
  output: { matchedPrefix: "The ", sortKey: "Book" },
} satisfies ToolExample<Input, Output>;
export const multilingualTitleSortPrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/multilingual-title-sort-prefix",
    title: "Multilingual Title Sort Prefix Tool",
    description:
      "Remove the longest literal caller-supplied nonfiling prefix without locale collation or language detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        suppliedPrefixes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
      },
      required: ["title", "suppliedPrefixes", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchedPrefix: { type: "string", maxLength: 8192 },
        sortKey: { type: "string", maxLength: 8192 },
      },
      required: ["matchedPrefix", "sortKey"],
    },
    ports: {
      inputs: [
        {
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPrefixes",
          label: "Supplied Prefixes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "matchedPrefix",
          label: "Matched Prefix",
          valueType: { type: "string" },
        },
        { id: "sortKey", label: "Sort Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = multilingualTitleSortPrefixTool.execute;
export default multilingualTitleSortPrefixTool;
