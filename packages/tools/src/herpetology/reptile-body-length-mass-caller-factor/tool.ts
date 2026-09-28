import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly coefficient: number;
  readonly exponent: number;
  readonly referenceMass: number;
};
export type Output = {
  readonly predictedMass: number;
  readonly residualMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", exclusiveMinimum: 0 },
    coefficient: { type: "number", minimum: 0 },
    exponent: { type: "number" },
    referenceMass: { type: "number", minimum: 0 },
  },
  required: ["length", "coefficient", "exponent", "referenceMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedMass: { type: "number" },
    residualMass: { type: "number" },
  },
  required: ["predictedMass", "residualMass"],
} as const;
/** Caller-calibrated allometric mass prediction and observed-minus-predicted residual, without a species-specific coefficient lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, coefficient, exponent, referenceMass } = request;
  const compute = (): Output => {
    H.positive(length);
    H.domain(coefficient >= 0 && referenceMass >= 0);
    return {
      predictedMass: coefficient * length ** exponent,
      residualMass: referenceMass - coefficient * length ** exponent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 10, coefficient: 0.02, exponent: 3, referenceMass: 25 },
  output: { predictedMass: 20, residualMass: 5 },
} satisfies ToolExample<Input, Output>;
export const reptileBodyLengthMassCallerFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-body-length-mass-caller-factor",
    title: "Reptile Body Length Mass Caller Factor Tool",
    description:
      "Caller-calibrated allometric mass prediction and observed-minus-predicted residual, without a species-specific coefficient lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number", exclusiveMinimum: 0 },
        coefficient: { type: "number", minimum: 0 },
        exponent: { type: "number" },
        referenceMass: { type: "number", minimum: 0 },
      },
      required: ["length", "coefficient", "exponent", "referenceMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedMass: { type: "number" },
        residualMass: { type: "number" },
      },
      required: ["predictedMass", "residualMass"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exponent",
          label: "Exponent",
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
          id: "predictedMass",
          label: "Predicted Mass",
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
export const run = reptileBodyLengthMassCallerFactorTool.execute;
export default reptileBodyLengthMassCallerFactorTool;
