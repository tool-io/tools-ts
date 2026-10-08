import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wetMass: number; readonly dryMass: number };
export type Output = {
  readonly waterMass: number;
  readonly waterWetFraction: number;
  readonly waterDryRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number" },
    dryMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["wetMass", "dryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number" },
    waterWetFraction: { type: "number" },
    waterDryRatio: { type: "number" },
  },
  required: ["waterMass", "waterWetFraction", "waterDryRatio"],
} as const;
/** Report both wet-basis water fraction and dry-basis water ratio from explicitly measured rock masses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryMass } = request;
  const compute = (): Output => {
    (H.domain(dryMass > 0, "dryMass"), dryMass);
    H.domain(wetMass >= dryMass, "wetMass");
    return {
      waterMass: wetMass - dryMass,
      waterWetFraction: (wetMass - dryMass) / wetMass,
      waterDryRatio: (wetMass - dryMass) / dryMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 120, dryMass: 100 },
  output: {
    waterMass: 20,
    waterWetFraction: 0.16666666666666666,
    waterDryRatio: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const rockDrywetMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/rock-dry-wet-mass-fraction",
    title: "Rock Dry Wet Mass Fraction",
    description:
      "Report both wet-basis water fraction and dry-basis water ratio from explicitly measured rock masses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number" },
        dryMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["wetMass", "dryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number" },
        waterWetFraction: { type: "number" },
        waterDryRatio: { type: "number" },
      },
      required: ["waterMass", "waterWetFraction", "waterDryRatio"],
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
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        {
          id: "waterWetFraction",
          label: "Water Wet Fraction",
          valueType: { type: "number" },
        },
        {
          id: "waterDryRatio",
          label: "Water Dry Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rockDrywetMassFractionTool.execute;
export default rockDrywetMassFractionTool;
