import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly year: number; readonly width: number };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    width: { type: "integer", minimum: 1, maximum: 20 },
  },
  required: ["year", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate proleptic year signed padding from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { year, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 20);
    return {
      text:
        (year < 0 ? "-" : "+") + String(Math.abs(year)).padStart(width, "0"),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: -44, width: 4 },
  output: { text: "-0044" },
} satisfies ToolExample<Input, Output>;
export const prolepticYearSignedPaddingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/proleptic-year-signed-padding",
    title: "Proleptic Year Signed Padding Tool",
    description:
      "Calculate proleptic year signed padding from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        width: { type: "integer", minimum: 1, maximum: 20 },
      },
      required: ["year", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { text: { type: "string", maxLength: 8192 } },
      required: ["text"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = prolepticYearSignedPaddingTool.execute;
export default prolepticYearSignedPaddingTool;
