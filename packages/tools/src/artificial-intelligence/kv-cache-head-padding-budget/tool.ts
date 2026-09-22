import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly heads: number;
  readonly headDimension: number;
  readonly paddedDimension: number;
  readonly tokens: number;
  readonly bytesPerElement: number;
  readonly kvCopies: number;
};
export type Output = {
  readonly usefulBytes: number;
  readonly paddingBytes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heads: { type: "integer", minimum: 1 },
    headDimension: { type: "integer", minimum: 1 },
    paddedDimension: { type: "integer" },
    tokens: { type: "integer", minimum: 0 },
    bytesPerElement: { type: "integer", minimum: 1 },
    kvCopies: { type: "integer", minimum: 1 },
  },
  required: [
    "heads",
    "headDimension",
    "paddedDimension",
    "tokens",
    "bytesPerElement",
    "kvCopies",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usefulBytes: { type: "integer" },
    paddingBytes: { type: "integer" },
  },
  required: ["usefulBytes", "paddingBytes"],
} as const;
/** Element storage arithmetic from supplied head, padding and copy counts; no model architecture is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    heads,
    headDimension,
    paddedDimension,
    tokens,
    bytesPerElement,
    kvCopies,
  } = request;
  const compute = (): Output => {
    H.integer(heads, 1);
    H.integer(headDimension, 1);
    H.integer(paddedDimension, headDimension);
    H.integer(tokens, 0);
    H.integer(bytesPerElement, 1);
    H.integer(kvCopies, 1);
    return {
      usefulBytes: heads * headDimension * tokens * bytesPerElement * kvCopies,
      paddingBytes:
        heads *
        (paddedDimension - headDimension) *
        tokens *
        bytesPerElement *
        kvCopies,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    heads: 8,
    headDimension: 64,
    paddedDimension: 80,
    tokens: 100,
    bytesPerElement: 2,
    kvCopies: 2,
  },
  output: { usefulBytes: 204800, paddingBytes: 51200 },
} satisfies ToolExample<Input, Output>;
export const kvCacheHeadPaddingBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/kv-cache-head-padding-budget",
    title: "Kv Cache Head Padding Budget Tool",
    description:
      "Element storage arithmetic from supplied head, padding and copy counts; no model architecture is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heads: { type: "integer", minimum: 1 },
        headDimension: { type: "integer", minimum: 1 },
        paddedDimension: { type: "integer" },
        tokens: { type: "integer", minimum: 0 },
        bytesPerElement: { type: "integer", minimum: 1 },
        kvCopies: { type: "integer", minimum: 1 },
      },
      required: [
        "heads",
        "headDimension",
        "paddedDimension",
        "tokens",
        "bytesPerElement",
        "kvCopies",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usefulBytes: { type: "integer" },
        paddingBytes: { type: "integer" },
      },
      required: ["usefulBytes", "paddingBytes"],
    },
    ports: {
      inputs: [
        {
          id: "heads",
          label: "Heads",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "headDimension",
          label: "Head Dimension",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "paddedDimension",
          label: "Padded Dimension",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tokens",
          label: "Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bytesPerElement",
          label: "Bytes Per Element",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "kvCopies",
          label: "Kv Copies",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "usefulBytes",
          label: "Useful Bytes",
          valueType: { type: "integer" },
        },
        {
          id: "paddingBytes",
          label: "Padding Bytes",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = kvCacheHeadPaddingBudgetTool.execute;
export default kvCacheHeadPaddingBudgetTool;
