import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reciprocalCentimeters: number };
export type Output = { readonly kaysers: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reciprocalCentimeters: { type: "number", minimum: 0 } },
  required: ["reciprocalCentimeters"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kaysers: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["kaysers", "label"],
} as const;
/** Label an explicit spectroscopic wavenumber in reciprocal centimeters and its numerically equal kayser value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reciprocalCentimeters } = request;
  const compute = (): Output => {
    H.domain(reciprocalCentimeters >= 0, "reciprocalCentimeters");
    return {
      kaysers: reciprocalCentimeters,
      label: reciprocalCentimeters + " cm^-1 (kayser)",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reciprocalCentimeters: 1250 },
  output: { kaysers: 1250, label: "1250 cm^-1 (kayser)" },
} satisfies ToolExample<Input, Output>;
export const reciprocalCentimeterToKayserLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["convert", "unit conversion", "computer science"],
      keywords: ["unit conversion", "computer science"],
    },
    id: "convert/reciprocal-centimeter-to-kayser-label",
    title: "Reciprocal Centimeter To Kayser Label",
    description:
      "Label an explicit spectroscopic wavenumber in reciprocal centimeters and its numerically equal kayser value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reciprocalCentimeters: { type: "number", minimum: 0 } },
      required: ["reciprocalCentimeters"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        kaysers: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["kaysers", "label"],
    },
    ports: {
      inputs: [
        {
          id: "reciprocalCentimeters",
          label: "Reciprocal Centimeters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "kaysers", label: "Kaysers", valueType: { type: "number" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = reciprocalCentimeterToKayserLabelTool.execute;
export default reciprocalCentimeterToKayserLabelTool;
