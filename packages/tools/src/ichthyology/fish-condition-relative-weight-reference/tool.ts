import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMass: number;
  readonly referenceMass: number;
};
export type Output = {
  readonly relativeWeight: number;
  readonly percentReference: number;
  readonly residualMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMass: { type: "number", minimum: 0 },
    referenceMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedMass", "referenceMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeWeight: { type: "number" },
    percentReference: { type: "number" },
    residualMass: { type: "number" },
  },
  required: ["relativeWeight", "percentReference", "residualMass"],
} as const;
/** Relative weight against an independently supplied length-specific reference mass, without selecting a species condition standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMass, referenceMass } = request;
  const compute = (): Output => {
    H.domain(observedMass >= 0);
    H.positive(referenceMass);
    return {
      relativeWeight: observedMass / referenceMass,
      percentReference: (100 * observedMass) / referenceMass,
      residualMass: observedMass - referenceMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMass: 120, referenceMass: 100 },
  output: { relativeWeight: 1.2, percentReference: 120, residualMass: 20 },
} satisfies ToolExample<Input, Output>;
export const fishConditionRelativeWeightReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ichthyology/fish-condition-relative-weight-reference",
      title: "Fish Condition Relative Weight Reference Tool",
      description:
        "Relative weight against an independently supplied length-specific reference mass, without selecting a species condition standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedMass: { type: "number", minimum: 0 },
          referenceMass: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observedMass", "referenceMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeWeight: { type: "number" },
          percentReference: { type: "number" },
          residualMass: { type: "number" },
        },
        required: ["relativeWeight", "percentReference", "residualMass"],
      },
      ports: {
        inputs: [
          {
            id: "observedMass",
            label: "Observed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceMass",
            label: "Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeWeight",
            label: "Relative Weight",
            valueType: { type: "number" },
          },
          {
            id: "percentReference",
            label: "Percent Reference",
            valueType: { type: "number" },
          },
          {
            id: "residualMass",
            label: "Residual Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fishConditionRelativeWeightReferenceTool.execute;
export default fishConditionRelativeWeightReferenceTool;
