import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly benefit: number;
  readonly harm: number;
  readonly weight: number;
};
export type Output = {
  readonly weightedValue: number;
  readonly weightDerivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefit: { type: "number" },
    harm: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["benefit", "harm", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedValue: { type: "number" },
    weightDerivative: { type: "number" },
  },
  required: ["weightedValue", "weightDerivative"],
} as const;
/** Calculate benefit harm explicit weight sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { benefit, harm, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return { weightedValue: benefit - weight * harm, weightDerivative: -harm };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { benefit: 10, harm: 3, weight: 2 },
  output: { weightedValue: 4, weightDerivative: -3 },
} satisfies ToolExample<Input, Output>;
export const benefitHarmExplicitWeightSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ethics/benefit-harm-explicit-weight-sensitivity",
      title: "Benefit Harm Explicit Weight Sensitivity Tool",
      description:
        "Calculate benefit harm explicit weight sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          benefit: { type: "number" },
          harm: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: ["benefit", "harm", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedValue: { type: "number" },
          weightDerivative: { type: "number" },
        },
        required: ["weightedValue", "weightDerivative"],
      },
      ports: {
        inputs: [
          {
            id: "benefit",
            label: "Benefit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "harm",
            label: "Harm",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedValue",
            label: "Weighted Value",
            valueType: { type: "number" },
          },
          {
            id: "weightDerivative",
            label: "Weight Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = benefitHarmExplicitWeightSensitivityTool.execute;
export default benefitHarmExplicitWeightSensitivityTool;
