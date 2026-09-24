import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly weight: number;
  readonly totalWeight: number;
  readonly missing: boolean;
};
export type Output = {
  readonly effectiveWeight: number;
  readonly weightedValue: number;
  readonly normalizedContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    weight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
    missing: { type: "boolean" },
  },
  required: ["value", "weight", "totalWeight", "missing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveWeight: { type: "number" },
    weightedValue: { type: "number" },
    normalizedContribution: { type: "number" },
  },
  required: ["effectiveWeight", "weightedValue", "normalizedContribution"],
} as const;
/** Calculate trial outcome one observation weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, weight, totalWeight, missing } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    H.positive(totalWeight);
    return {
      effectiveWeight: missing ? 0 : weight,
      weightedValue: missing ? 0 : value * weight,
      normalizedContribution: missing ? 0 : (value * weight) / totalWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, weight: 2, totalWeight: 10, missing: false },
  output: { effectiveWeight: 2, weightedValue: 10, normalizedContribution: 1 },
} satisfies ToolExample<Input, Output>;
export const trialOutcomeOneObservationWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-outcome-one-observation-weight",
    title: "Trial Outcome One Observation Weight Tool",
    description:
      "Calculate trial outcome one observation weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        weight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
        missing: { type: "boolean" },
      },
      required: ["value", "weight", "totalWeight", "missing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveWeight: { type: "number" },
        weightedValue: { type: "number" },
        normalizedContribution: { type: "number" },
      },
      required: ["effectiveWeight", "weightedValue", "normalizedContribution"],
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
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "effectiveWeight",
          label: "Effective Weight",
          valueType: { type: "number" },
        },
        {
          id: "weightedValue",
          label: "Weighted Value",
          valueType: { type: "number" },
        },
        {
          id: "normalizedContribution",
          label: "Normalized Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialOutcomeOneObservationWeightTool.execute;
export default trialOutcomeOneObservationWeightTool;
