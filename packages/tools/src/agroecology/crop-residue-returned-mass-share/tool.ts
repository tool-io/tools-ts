import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalResidueDryMass: number;
  readonly returnedDryMass: number;
};
export type Output = {
  readonly returnedFraction: number;
  readonly removedDryMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalResidueDryMass: { type: "number", exclusiveMinimum: 0 },
    returnedDryMass: { type: "number", minimum: 0 },
  },
  required: ["totalResidueDryMass", "returnedDryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedFraction: { type: "number" },
    removedDryMass: { type: "number" },
  },
  required: ["returnedFraction", "removedDryMass"],
} as const;
/** Split a recorded residue dry-mass total into returned and removed portions without recommending a residue treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalResidueDryMass, returnedDryMass } = request;
  const compute = (): Output => {
    (H.domain(totalResidueDryMass > 0, "totalResidueDryMass"),
      totalResidueDryMass);
    H.domain(
      returnedDryMass >= 0 && returnedDryMass <= totalResidueDryMass,
      "returnedDryMass",
    );
    return {
      returnedFraction: returnedDryMass / totalResidueDryMass,
      removedDryMass: totalResidueDryMass - returnedDryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalResidueDryMass: 80, returnedDryMass: 60 },
  output: { returnedFraction: 0.75, removedDryMass: 20 },
} satisfies ToolExample<Input, Output>;
export const cropResidueReturnedMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/crop-residue-returned-mass-share",
    title: "Crop Residue Returned Mass Share",
    description:
      "Split a recorded residue dry-mass total into returned and removed portions without recommending a residue treatment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalResidueDryMass: { type: "number", exclusiveMinimum: 0 },
        returnedDryMass: { type: "number", minimum: 0 },
      },
      required: ["totalResidueDryMass", "returnedDryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedFraction: { type: "number" },
        removedDryMass: { type: "number" },
      },
      required: ["returnedFraction", "removedDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "totalResidueDryMass",
          label: "Total Residue Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedDryMass",
          label: "Returned Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "returnedFraction",
          label: "Returned Fraction",
          valueType: { type: "number" },
        },
        {
          id: "removedDryMass",
          label: "Removed Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropResidueReturnedMassShareTool.execute;
export default cropResidueReturnedMassShareTool;
