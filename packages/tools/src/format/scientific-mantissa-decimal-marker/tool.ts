import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mantissa: string;
  readonly decimalMarker: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mantissa: { type: "string", maxLength: 8192 },
    decimalMarker: { type: "string", maxLength: 8192, enum: [".", ","] },
  },
  required: ["mantissa", "decimalMarker"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Change the display decimal marker of a validated ASCII mantissa without locale inference. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { mantissa, decimalMarker } = input;
  const compute = (): Output => {
    H.domain(
      [".", ","].includes(decimalMarker) &&
        /^[+-]?\d+(?:\.\d+)?(?![\s\S])/.test(mantissa),
    );
    return { text: mantissa.replace(".", decimalMarker) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mantissa: "1.25", decimalMarker: "," },
  output: { text: "1,25" },
} satisfies ToolExample<Input, Output>;
export const scientificMantissaDecimalMarkerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/scientific-mantissa-decimal-marker",
    title: "Scientific Mantissa Decimal Marker Tool",
    description:
      "Change the display decimal marker of a validated ASCII mantissa without locale inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mantissa: { type: "string", maxLength: 8192 },
        decimalMarker: { type: "string", maxLength: 8192, enum: [".", ","] },
      },
      required: ["mantissa", "decimalMarker"],
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
          id: "mantissa",
          label: "Mantissa",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "decimalMarker",
          label: "Decimal Marker",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = scientificMantissaDecimalMarkerTool.execute;
export default scientificMantissaDecimalMarkerTool;
