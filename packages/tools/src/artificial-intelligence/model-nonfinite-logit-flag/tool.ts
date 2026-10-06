import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly logitTokens: readonly string[] };
export type Output = {
  readonly nonfiniteIndices: readonly number[];
  readonly allFinite: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logitTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["logitTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonfiniteIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    allFinite: { type: "boolean" },
  },
  required: ["nonfiniteIndices", "allFinite"],
} as const;
/** Classify explicit decimal or NaN/Infinity text tokens for nonfinite logits without placing nonfinite numbers in a portable JSON input. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logitTokens } = request;
  const compute = (): Output => {
    return (() => {
      const nonfiniteIndices: number[] = [];
      logitTokens.forEach((value, index) => {
        H.domain(
          /^(?:NaN|[+-]?Infinity|[+-]?(?:\d+(?:[.]\d*)?|[.]\d+)(?:[eE][+-]?\d+)?)(?![\s\S])/.test(
            value,
          ),
          "logitTokens",
        );
        if (!Number.isFinite(Number(value))) nonfiniteIndices.push(index);
      });
      return { nonfiniteIndices, allFinite: nonfiniteIndices.length === 0 };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logitTokens: ["1.5", "Infinity", "NaN"] },
  output: { nonfiniteIndices: [1, 2], allFinite: false },
} satisfies ToolExample<Input, Output>;
export const modelNonfiniteLogitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/model-nonfinite-logit-flag",
    title: "Model Nonfinite Logit Flag",
    description:
      "Classify explicit decimal or NaN/Infinity text tokens for nonfinite logits without placing nonfinite numbers in a portable JSON input.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logitTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["logitTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonfiniteIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        allFinite: { type: "boolean" },
      },
      required: ["nonfiniteIndices", "allFinite"],
    },
    ports: {
      inputs: [
        {
          id: "logitTokens",
          label: "Logit Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "nonfiniteIndices",
          label: "Nonfinite Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "allFinite",
          label: "All Finite",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = modelNonfiniteLogitFlagTool.execute;
export default modelNonfiniteLogitFlagTool;
