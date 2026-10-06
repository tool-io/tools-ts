import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalAreaSquareMeters: number;
  readonly usableFraction: number;
};
export type Output = { readonly effectiveAreaSquareMeters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalAreaSquareMeters: { type: "number", minimum: 0 },
    usableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["nominalAreaSquareMeters", "usableFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveAreaSquareMeters: { type: "number" } },
  required: ["effectiveAreaSquareMeters"],
} as const;
/** Apply an explicitly measured usable-area fraction to a benthic grab’s nominal sampling area. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalAreaSquareMeters, usableFraction } = request;
  const compute = (): Output => {
    H.domain(nominalAreaSquareMeters >= 0, "nominalAreaSquareMeters");
    (H.domain(usableFraction >= 0 && usableFraction <= 1, "usableFraction"),
      usableFraction);
    return {
      effectiveAreaSquareMeters: nominalAreaSquareMeters * usableFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalAreaSquareMeters: 0.1, usableFraction: 0.8 },
  output: { effectiveAreaSquareMeters: 0.08000000000000002 },
} satisfies ToolExample<Input, Output>;
export const benthicGrabEffectiveAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/benthic-grab-effective-area",
    title: "Benthic Grab Effective Area",
    description:
      "Apply an explicitly measured usable-area fraction to a benthic grab’s nominal sampling area.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalAreaSquareMeters: { type: "number", minimum: 0 },
        usableFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["nominalAreaSquareMeters", "usableFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { effectiveAreaSquareMeters: { type: "number" } },
      required: ["effectiveAreaSquareMeters"],
    },
    ports: {
      inputs: [
        {
          id: "nominalAreaSquareMeters",
          label: "Nominal Area Square Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "usableFraction",
          label: "Usable Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveAreaSquareMeters",
          label: "Effective Area Square Meters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = benthicGrabEffectiveAreaTool.execute;
export default benthicGrabEffectiveAreaTool;
