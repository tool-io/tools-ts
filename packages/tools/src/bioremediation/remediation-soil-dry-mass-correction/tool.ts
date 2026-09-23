import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly waterFraction: number;
  readonly concentrationWet: number;
};
export type Output = {
  readonly dryMass: number;
  readonly concentrationDry: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    concentrationWet: { type: "number" },
  },
  required: ["wetMass", "waterFraction", "concentrationWet"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    concentrationDry: { type: "number" },
  },
  required: ["dryMass", "concentrationDry"],
} as const;
/** Calculate remediation soil dry mass correction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, waterFraction, concentrationWet } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0 && waterFraction >= 0 && waterFraction < 1);
    return {
      dryMass: wetMass * (1 - waterFraction),
      concentrationDry: concentrationWet / (1 - waterFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 100, waterFraction: 0.2, concentrationWet: 8 },
  output: { dryMass: 80, concentrationDry: 10 },
} satisfies ToolExample<Input, Output>;
export const remediationSoilDryMassCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioremediation/remediation-soil-dry-mass-correction",
    title: "Remediation Soil Dry Mass Correction Tool",
    description:
      "Calculate remediation soil dry mass correction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
        concentrationWet: { type: "number" },
      },
      required: ["wetMass", "waterFraction", "concentrationWet"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        concentrationDry: { type: "number" },
      },
      required: ["dryMass", "concentrationDry"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "concentrationWet",
          label: "Concentration Wet",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "concentrationDry",
          label: "Concentration Dry",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationSoilDryMassCorrectionTool.execute;
export default remediationSoilDryMassCorrectionTool;
