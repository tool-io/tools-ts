import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceMass: number;
  readonly referenceRate: number;
  readonly bodyMass: number;
  readonly exponent: number;
};
export type Output = {
  readonly relativeMass: number;
  readonly predictedRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceMass: { type: "number", exclusiveMinimum: 0 },
    referenceRate: { type: "number", minimum: 0 },
    bodyMass: { type: "number", exclusiveMinimum: 0 },
    exponent: { type: "number" },
  },
  required: ["referenceMass", "referenceRate", "bodyMass", "exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeMass: { type: "number" },
    predictedRate: { type: "number" },
  },
  required: ["relativeMass", "predictedRate"],
} as const;
/** Reference-normalized allometric metabolic rate with an explicit fitted exponent, not a universal quarter-power law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceMass, referenceRate, bodyMass, exponent } = request;
  const compute = (): Output => {
    H.positive(referenceMass);
    H.positive(bodyMass);
    H.domain(referenceRate >= 0);
    return {
      relativeMass: bodyMass / referenceMass,
      predictedRate: referenceRate * (bodyMass / referenceMass) ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceMass: 10, referenceRate: 4, bodyMass: 40, exponent: 0.5 },
  output: { relativeMass: 4, predictedRate: 8 },
} satisfies ToolExample<Input, Output>;
export const ecologicalMetabolismBodyMassExponentTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/ecological-metabolism-body-mass-exponent-term",
      title: "Ecological Metabolism Body Mass Exponent Term Tool",
      description:
        "Reference-normalized allometric metabolic rate with an explicit fitted exponent, not a universal quarter-power law.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceMass: { type: "number", exclusiveMinimum: 0 },
          referenceRate: { type: "number", minimum: 0 },
          bodyMass: { type: "number", exclusiveMinimum: 0 },
          exponent: { type: "number" },
        },
        required: ["referenceMass", "referenceRate", "bodyMass", "exponent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeMass: { type: "number" },
          predictedRate: { type: "number" },
        },
        required: ["relativeMass", "predictedRate"],
      },
      ports: {
        inputs: [
          {
            id: "referenceMass",
            label: "Reference Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceRate",
            label: "Reference Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "bodyMass",
            label: "Body Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exponent",
            label: "Exponent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeMass",
            label: "Relative Mass",
            valueType: { type: "number" },
          },
          {
            id: "predictedRate",
            label: "Predicted Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecologicalMetabolismBodyMassExponentTermTool.execute;
export default ecologicalMetabolismBodyMassExponentTermTool;
