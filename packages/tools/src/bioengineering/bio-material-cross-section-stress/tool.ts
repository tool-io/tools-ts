import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forceNewtons: number;
  readonly areaSquareMillimeters: number;
};
export type Output = { readonly stressMegapascals: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forceNewtons: { type: "number" },
    areaSquareMillimeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["forceNewtons", "areaSquareMillimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stressMegapascals: { type: "number" } },
  required: ["stressMegapascals"],
} as const;
/** Compute signed nominal uniaxial bench stress from force and positive cross-sectional area, with N/mm² equal to MPa. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forceNewtons, areaSquareMillimeters } = request;
  const compute = (): Output => {
    (H.domain(areaSquareMillimeters > 0, "areaSquareMillimeters"),
      areaSquareMillimeters);
    return { stressMegapascals: forceNewtons / areaSquareMillimeters };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forceNewtons: 100, areaSquareMillimeters: 20 },
  output: { stressMegapascals: 5 },
} satisfies ToolExample<Input, Output>;
export const bioMaterialCrossSectionStressTool = H.defineSchemaCalculation<
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
    id: "bioengineering/bio-material-cross-section-stress",
    title: "Bio Material Cross Section Stress",
    description:
      "Compute signed nominal uniaxial bench stress from force and positive cross-sectional area, with N/mm² equal to MPa.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forceNewtons: { type: "number" },
        areaSquareMillimeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["forceNewtons", "areaSquareMillimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stressMegapascals: { type: "number" } },
      required: ["stressMegapascals"],
    },
    ports: {
      inputs: [
        {
          id: "forceNewtons",
          label: "Force Newtons",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaSquareMillimeters",
          label: "Area Square Millimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stressMegapascals",
          label: "Stress Megapascals",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bioMaterialCrossSectionStressTool.execute;
export default bioMaterialCrossSectionStressTool;
