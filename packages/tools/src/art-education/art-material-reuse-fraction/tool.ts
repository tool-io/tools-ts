import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reusableMass: number;
  readonly totalUsedMass: number;
};
export type Output = {
  readonly reuseFraction: number;
  readonly nonreusableMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reusableMass: { type: "number", minimum: 0 },
    totalUsedMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reusableMass", "totalUsedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reuseFraction: { type: "number" },
    nonreusableMass: { type: "number" },
  },
  required: ["reuseFraction", "nonreusableMass"],
} as const;
/** Describe the measured reusable share of a studio material batch without determining material safety or suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reusableMass, totalUsedMass } = request;
  const compute = (): Output => {
    (H.domain(totalUsedMass > 0, "totalUsedMass"), totalUsedMass);
    H.domain(
      reusableMass >= 0 && reusableMass <= totalUsedMass,
      "reusableMass",
    );
    return {
      reuseFraction: reusableMass / totalUsedMass,
      nonreusableMass: totalUsedMass - reusableMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reusableMass: 30, totalUsedMass: 50 },
  output: { reuseFraction: 0.6, nonreusableMass: 20 },
} satisfies ToolExample<Input, Output>;
export const artMaterialReuseFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/art-material-reuse-fraction",
    title: "Art Material Reuse Fraction",
    description:
      "Describe the measured reusable share of a studio material batch without determining material safety or suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reusableMass: { type: "number", minimum: 0 },
        totalUsedMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reusableMass", "totalUsedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reuseFraction: { type: "number" },
        nonreusableMass: { type: "number" },
      },
      required: ["reuseFraction", "nonreusableMass"],
    },
    ports: {
      inputs: [
        {
          id: "reusableMass",
          label: "Reusable Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalUsedMass",
          label: "Total Used Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "reuseFraction",
          label: "Reuse Fraction",
          valueType: { type: "number" },
        },
        {
          id: "nonreusableMass",
          label: "Nonreusable Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = artMaterialReuseFractionTool.execute;
export default artMaterialReuseFractionTool;
