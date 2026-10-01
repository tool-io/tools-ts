import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lowerCutpoint: number;
  readonly upperCutpoint: number;
};
export type Output = {
  readonly normalized: number;
  readonly below: boolean;
  readonly above: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lowerCutpoint: { type: "number" },
    upperCutpoint: { type: "number" },
  },
  required: ["value", "lowerCutpoint", "upperCutpoint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "number" },
    below: { type: "boolean" },
    above: { type: "boolean" },
  },
  required: ["normalized", "below", "above"],
} as const;
/** Calculate percentile scaler explicit cutpoint gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lowerCutpoint, upperCutpoint } = request;
  const compute = (): Output => {
    H.domain(lowerCutpoint < upperCutpoint);
    return {
      normalized: (value - lowerCutpoint) / (upperCutpoint - lowerCutpoint),
      below: value < lowerCutpoint,
      above: value > upperCutpoint,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 12, lowerCutpoint: 2, upperCutpoint: 10 },
  output: { normalized: 1.25, below: false, above: true },
} satisfies ToolExample<Input, Output>;
export const percentileScalerExplicitCutpointGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "normalize/percentile-scaler-explicit-cutpoint-gap",
      title: "Percentile Scaler Explicit Cutpoint Gap Tool",
      description:
        "Calculate percentile scaler explicit cutpoint gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "number" },
          lowerCutpoint: { type: "number" },
          upperCutpoint: { type: "number" },
        },
        required: ["value", "lowerCutpoint", "upperCutpoint"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "number" },
          below: { type: "boolean" },
          above: { type: "boolean" },
        },
        required: ["normalized", "below", "above"],
      },
      ports: {
        inputs: [
          {
            id: "value",
            label: "Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerCutpoint",
            label: "Lower Cutpoint",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperCutpoint",
            label: "Upper Cutpoint",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
          { id: "below", label: "Below", valueType: { type: "boolean" } },
          { id: "above", label: "Above", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = percentileScalerExplicitCutpointGapTool.execute;
export default percentileScalerExplicitCutpointGapTool;
