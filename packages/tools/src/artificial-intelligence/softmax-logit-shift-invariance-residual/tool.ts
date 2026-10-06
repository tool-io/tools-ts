import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logits: readonly number[];
  readonly shift: number;
};
export type Output = { readonly maximumProbabilityDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logits: { type: "array", maxItems: 256, items: { type: "number" } },
    shift: { type: "number" },
  },
  required: ["logits", "shift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { maximumProbabilityDifference: { type: "number" } },
  required: ["maximumProbabilityDifference"],
} as const;
/** Measure binary64 softmax probability change after adding an explicit finite common logit shift using max-subtracted exponentials. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logits, shift } = request;
  const compute = (): Output => {
    return (() => {
      H.domain(logits.length > 0, "logits");
      const softmax = (values: readonly number[]): number[] => {
        const high = Math.max(...values),
          weights = values.map((value) => Math.exp(value - high)),
          total = weights.reduce((a, b) => a + b, 0);
        return weights.map((value) => value / total);
      };
      const shifted = logits.map((value) => value + shift);
      H.domain(shifted.every(Number.isFinite), "shift");
      const a = softmax(logits),
        b = softmax(shifted);
      return {
        maximumProbabilityDifference: Math.max(
          ...a.map((value, index) => Math.abs(value - b[index])),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logits: [0, 0], shift: 5 },
  output: { maximumProbabilityDifference: 0 },
} satisfies ToolExample<Input, Output>;
export const softmaxLogitShiftInvarianceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
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
      id: "artificial-intelligence/softmax-logit-shift-invariance-residual",
      title: "Softmax Logit Shift Invariance Residual",
      description:
        "Measure binary64 softmax probability change after adding an explicit finite common logit shift using max-subtracted exponentials.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logits: { type: "array", maxItems: 256, items: { type: "number" } },
          shift: { type: "number" },
        },
        required: ["logits", "shift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { maximumProbabilityDifference: { type: "number" } },
        required: ["maximumProbabilityDifference"],
      },
      ports: {
        inputs: [
          {
            id: "logits",
            label: "Logits",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "shift",
            label: "Shift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "maximumProbabilityDifference",
            label: "Maximum Probability Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = softmaxLogitShiftInvarianceResidualTool.execute;
export default softmaxLogitShiftInvarianceResidualTool;
