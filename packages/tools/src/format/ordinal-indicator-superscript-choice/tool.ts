import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly superscript: boolean };
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "integer", minimum: 0 },
    superscript: { type: "boolean" },
  },
  required: ["value", "superscript"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Calculate ordinal indicator superscript choice from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, superscript } = request;
  const compute = (): Output => {
    H.integer(value, 0);
    const last = value % 100,
      suffix =
        last >= 11 && last <= 13
          ? "th"
          : value % 10 === 1
            ? "st"
            : value % 10 === 2
              ? "nd"
              : value % 10 === 3
                ? "rd"
                : "th",
      raised =
        suffix === "st"
          ? "ˢᵗ"
          : suffix === "nd"
            ? "ⁿᵈ"
            : suffix === "rd"
              ? "ʳᵈ"
              : "ᵗʰ";
    return { text: value + (superscript ? raised : suffix) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 21, superscript: true },
  output: { text: "21ˢᵗ" },
} satisfies ToolExample<Input, Output>;
export const ordinalIndicatorSuperscriptChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/ordinal-indicator-superscript-choice",
    title: "Ordinal Indicator Superscript Choice Tool",
    description:
      "Calculate ordinal indicator superscript choice from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "integer", minimum: 0 },
        superscript: { type: "boolean" },
      },
      required: ["value", "superscript"],
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
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "superscript",
          label: "Superscript",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ordinalIndicatorSuperscriptChoiceTool.execute;
export default ordinalIndicatorSuperscriptChoiceTool;
