import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly girth: number;
  readonly bodyLength: number;
  readonly coefficient: number;
  readonly exponent: number;
  readonly intercept: number;
};
export type Output = { readonly estimatedMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    girth: { type: "number", exclusiveMinimum: 0 },
    bodyLength: { type: "number", minimum: 0 },
    coefficient: { type: "number", minimum: 0 },
    exponent: { type: "number", exclusiveMinimum: 0 },
    intercept: { type: "number", minimum: 0 },
  },
  required: ["girth", "bodyLength", "coefficient", "exponent", "intercept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { estimatedMass: { type: "number" } },
  required: ["estimatedMass"],
} as const;
/** Explicit caller-calibrated allometric girth/length estimate; no species calibration or clinical decision is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { girth, bodyLength, coefficient, exponent, intercept } = request;
  const compute = (): Output => {
    H.positive(girth);
    H.domain(
      bodyLength >= 0 && coefficient >= 0 && exponent > 0 && intercept >= 0,
    );
    return {
      estimatedMass: intercept + coefficient * girth ** exponent * bodyLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { girth: 2, bodyLength: 3, coefficient: 4, exponent: 2, intercept: 1 },
  output: { estimatedMass: 49 },
} satisfies ToolExample<Input, Output>;
export const animalWeightGirthCalibrationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/animal-weight-girth-calibration-term",
    title: "Animal Weight Girth Calibration Term Tool",
    description:
      "Explicit caller-calibrated allometric girth/length estimate; no species calibration or clinical decision is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        girth: { type: "number", exclusiveMinimum: 0 },
        bodyLength: { type: "number", minimum: 0 },
        coefficient: { type: "number", minimum: 0 },
        exponent: { type: "number", exclusiveMinimum: 0 },
        intercept: { type: "number", minimum: 0 },
      },
      required: ["girth", "bodyLength", "coefficient", "exponent", "intercept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { estimatedMass: { type: "number" } },
      required: ["estimatedMass"],
    },
    ports: {
      inputs: [
        {
          id: "girth",
          label: "Girth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bodyLength",
          label: "Body Length",
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
          id: "intercept",
          label: "Intercept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedMass",
          label: "Estimated Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = animalWeightGirthCalibrationTermTool.execute;
export default animalWeightGirthCalibrationTermTool;
