import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  sameLength,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly weights: readonly number[];
  readonly missing: readonly boolean[];
};
export type Output = {
  readonly retainedWeight: number;
  readonly excludedWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["weights", "missing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedWeight: { type: "number" },
    excludedWeight: { type: "number" },
  },
  required: ["retainedWeight", "excludedWeight"],
} as const;
/** Compute masked scaler denominator adjustment from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { weights, missing } = input;
  const compute = (): Output => {
    sameLength(weights, missing);
    domain(weights.every((x) => x >= 0));
    let retainedWeight = 0,
      excludedWeight = 0;
    weights.forEach((x, i) => {
      if (missing[i]) excludedWeight += x;
      else retainedWeight += x;
    });
    return { retainedWeight, excludedWeight };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { weights: [2, 3, 5], missing: [false, true, false] },
  output: { retainedWeight: 7, excludedWeight: 3 },
} satisfies ToolExample<Input, Output>;
export const maskedScalerDenominatorAdjustmentTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "normalize/masked-scaler-denominator-adjustment",
  title: "Masked Scaler Denominator Adjustment Tool",
  description:
    "Compute masked scaler denominator adjustment from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "weights",
        label: "Weights",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "missing",
        label: "Missing",
        required: true,
        valueType: { type: "list", items: { type: "boolean" } },
      },
    ],
    outputs: [
      {
        id: "retainedWeight",
        label: "Retained Weight",
        valueType: { type: "number" },
      },
      {
        id: "excludedWeight",
        label: "Excluded Weight",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = maskedScalerDenominatorAdjustmentTool.execute;
export default maskedScalerDenominatorAdjustmentTool;
