import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly exponent: number };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exponent: { type: "integer" } },
  required: ["exponent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate scientific exponent unicode minus from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exponent } = request;
  const compute = (): Output => {
    return { text: exponent < 0 ? "−" + Math.abs(exponent) : "+" + exponent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exponent: -12 },
  output: { text: "−12" },
} satisfies ToolExample<Input, Output>;
export const scientificExponentUnicodeMinusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/scientific-exponent-unicode-minus",
    title: "Scientific Exponent Unicode Minus Tool",
    description:
      "Calculate scientific exponent unicode minus from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exponent: { type: "integer" } },
      required: ["exponent"],
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
          id: "exponent",
          label: "Exponent",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = scientificExponentUnicodeMinusTool.execute;
export default scientificExponentUnicodeMinusTool;
