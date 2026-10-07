import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wetMass: number; readonly dryMass: number };
export type Output = {
  readonly waterMass: number;
  readonly waterMassFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", exclusiveMinimum: 0 },
    dryMass: { type: "number", minimum: 0 },
  },
  required: ["wetMass", "dryMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number" },
    waterMassFraction: { type: "number" },
  },
  required: ["waterMass", "waterMassFraction"],
} as const;
/** Calculate wet-minus-dry mass and its wet-basis fraction for a supplied tissue construct without assigning composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(wetMass) && wetMass > 0, "wetMass"), wetMass);
    H.domain(dryMass >= 0 && dryMass <= wetMass, "dryMass");
    return {
      waterMass: wetMass - dryMass,
      waterMassFraction: (wetMass - dryMass) / wetMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 12, dryMass: 3 },
  output: { waterMass: 9, waterMassFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const tissueConstructHydrationMassShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioengineering", "engineering"],
      keywords: ["bioengineering", "engineering"],
    },
    id: "bioengineering/tissue-construct-hydration-mass-share",
    title: "Tissue Construct Hydration Mass Share",
    description:
      "Calculate wet-minus-dry mass and its wet-basis fraction for a supplied tissue construct without assigning composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", exclusiveMinimum: 0 },
        dryMass: { type: "number", minimum: 0 },
      },
      required: ["wetMass", "dryMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number" },
        waterMassFraction: { type: "number" },
      },
      required: ["waterMass", "waterMassFraction"],
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
          id: "waterMassFraction",
          label: "Water Mass Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueConstructHydrationMassShareTool.execute;
export default tissueConstructHydrationMassShareTool;
