import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gross: number;
  readonly tare: number;
  readonly blankResidue: number;
  readonly sampleMass: number;
};
export type Output = {
  readonly netResidue: number;
  readonly massFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number", minimum: 0 },
    tare: { type: "number", minimum: 0 },
    blankResidue: { type: "number", minimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["gross", "tare", "blankResidue", "sampleMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netResidue: { type: "number" },
    massFraction: { type: "number" },
  },
  required: ["netResidue", "massFraction"],
} as const;
/** Preserve signed blank-corrected analytical results rather than clamping negatives. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gross, tare, blankResidue, sampleMass } = request;
  const compute = (): Output => {
    H.domain(gross >= 0 && tare >= 0 && blankResidue >= 0);
    H.positive(sampleMass);
    return {
      netResidue: gross - tare - blankResidue,
      massFraction: (gross - tare - blankResidue) / sampleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gross: 12, tare: 10, blankResidue: 0.5, sampleMass: 5 },
  output: { netResidue: 1.5, massFraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const foodSampleBlankNetmassCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-sample-blank-netmass-correction",
    title: "Food Sample Blank Netmass Correction Tool",
    description:
      "Preserve signed blank-corrected analytical results rather than clamping negatives.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number", minimum: 0 },
        tare: { type: "number", minimum: 0 },
        blankResidue: { type: "number", minimum: 0 },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["gross", "tare", "blankResidue", "sampleMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netResidue: { type: "number" },
        massFraction: { type: "number" },
      },
      required: ["netResidue", "massFraction"],
    },
    ports: {
      inputs: [
        {
          id: "gross",
          label: "Gross",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tare",
          label: "Tare",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankResidue",
          label: "Blank Residue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netResidue",
          label: "Net Residue",
          valueType: { type: "number" },
        },
        {
          id: "massFraction",
          label: "Mass Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSampleBlankNetmassCorrectionTool.execute;
export default foodSampleBlankNetmassCorrectionTool;
