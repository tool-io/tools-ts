import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly siglum: string; readonly reading: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siglum: { type: "string", maxLength: 8192, minLength: 1 },
    reading: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["siglum", "reading"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a textual witness siglum with a literal variant reading without establishing textual priority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siglum, reading } = request;
  const compute = (): Output => {
    H.domain(siglum.length > 0 && reading.length > 0, "siglum");
    return { label: siglum + ": " + JSON.stringify(reading) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siglum: "A", reading: "variant reading" },
  output: { label: 'A: "variant reading"' },
} satisfies ToolExample<Input, Output>;
export const textualVariantWitnessSiglumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/textual-variant-witness-siglum",
    title: "Textual Variant Witness Siglum",
    description:
      "Format a textual witness siglum with a literal variant reading without establishing textual priority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siglum: { type: "string", maxLength: 8192, minLength: 1 },
        reading: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["siglum", "reading"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "siglum",
          label: "Siglum",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reading",
          label: "Reading",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = textualVariantWitnessSiglumTool.execute;
export default textualVariantWitnessSiglumTool;
