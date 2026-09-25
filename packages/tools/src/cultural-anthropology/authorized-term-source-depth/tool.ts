import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly term: string;
  readonly sourcePath: readonly string[];
  readonly authorizedPrefixes: readonly string[];
  readonly separator: string;
};
export type Output = {
  readonly depth: number;
  readonly authorizedBySuppliedPrefix: boolean;
  readonly termPresent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    term: { type: "string", maxLength: 8192 },
    sourcePath: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorizedPrefixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["term", "sourcePath", "authorizedPrefixes", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer" },
    authorizedBySuppliedPrefix: { type: "boolean" },
    termPresent: { type: "boolean" },
  },
  required: ["depth", "authorizedBySuppliedPrefix", "termPresent"],
} as const;
/** Inspect explicit authorization-prefix metadata for a supplied term, without deriving permissions from cultural content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { term, sourcePath, authorizedPrefixes, separator } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(separator.length > 0);
      const source = sourcePath.join(separator);
      return {
        depth: sourcePath.length,
        authorizedBySuppliedPrefix: authorizedPrefixes.some(
          (x) => source === x || source.startsWith(x + separator),
        ),
        termPresent: term.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    term: "word",
    sourcePath: ["archive", "collection"],
    authorizedPrefixes: ["archive"],
    separator: "/",
  },
  output: { depth: 2, authorizedBySuppliedPrefix: true, termPresent: true },
} satisfies ToolExample<Input, Output>;
export const authorizedTermSourceDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/authorized-term-source-depth",
    title: "Authorized Term Source Depth Tool",
    description:
      "Inspect explicit authorization-prefix metadata for a supplied term, without deriving permissions from cultural content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        term: { type: "string", maxLength: 8192 },
        sourcePath: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorizedPrefixes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["term", "sourcePath", "authorizedPrefixes", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer" },
        authorizedBySuppliedPrefix: { type: "boolean" },
        termPresent: { type: "boolean" },
      },
      required: ["depth", "authorizedBySuppliedPrefix", "termPresent"],
    },
    ports: {
      inputs: [
        {
          id: "term",
          label: "Term",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourcePath",
          label: "Source Path",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorizedPrefixes",
          label: "Authorized Prefixes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
        {
          id: "authorizedBySuppliedPrefix",
          label: "Authorized By Supplied Prefix",
          valueType: { type: "boolean" },
        },
        {
          id: "termPresent",
          label: "Term Present",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedTermSourceDepthTool.execute;
export default authorizedTermSourceDepthTool;
