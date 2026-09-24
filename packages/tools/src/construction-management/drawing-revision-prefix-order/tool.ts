import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefix: string;
  readonly number: number;
  readonly suppliedPrefixes: readonly string[];
};
export type Output = {
  readonly prefixRank: number;
  readonly revisionNumber: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    number: { type: "integer", minimum: 0 },
    suppliedPrefixes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["prefix", "number", "suppliedPrefixes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixRank: { type: "integer" },
    revisionNumber: { type: "integer" },
  },
  required: ["prefixRank", "revisionNumber"],
} as const;
/** Build a revision ordering key from a supplied prefix order, without interpreting project issue status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefix, number, suppliedPrefixes } = request;
  const compute = (): Output => {
    H.integer(number, 0);
    H.domain(new Set(suppliedPrefixes).size === suppliedPrefixes.length);
    const prefixRank = suppliedPrefixes.indexOf(prefix);
    H.domain(prefixRank >= 0);
    return { prefixRank, revisionNumber: number };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefix: "P", number: 3, suppliedPrefixes: ["P", "C"] },
  output: { prefixRank: 0, revisionNumber: 3 },
} satisfies ToolExample<Input, Output>;
export const drawingRevisionPrefixOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "construction-management/drawing-revision-prefix-order",
    title: "Drawing Revision Prefix Order Tool",
    description:
      "Build a revision ordering key from a supplied prefix order, without interpreting project issue status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        number: { type: "integer", minimum: 0 },
        suppliedPrefixes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["prefix", "number", "suppliedPrefixes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixRank: { type: "integer" },
        revisionNumber: { type: "integer" },
      },
      required: ["prefixRank", "revisionNumber"],
    },
    ports: {
      inputs: [
        {
          id: "prefix",
          label: "Prefix",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "number",
          label: "Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedPrefixes",
          label: "Supplied Prefixes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "prefixRank",
          label: "Prefix Rank",
          valueType: { type: "integer" },
        },
        {
          id: "revisionNumber",
          label: "Revision Number",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = drawingRevisionPrefixOrderTool.execute;
export default drawingRevisionPrefixOrderTool;
