import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly numeral: string; readonly overlined: boolean };
export type Output = { readonly text: string; readonly multiplier: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numeral: { type: "string", maxLength: 8192 },
    overlined: { type: "boolean" },
  },
  required: ["numeral", "overlined"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    text: { type: "string", maxLength: 8192 },
    multiplier: { type: "integer" },
  },
  required: ["text", "multiplier"],
} as const;
/** Render a supplied Roman numeral token with a combining overline and explicit thousand multiplier. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { numeral, overlined } = input;
  const compute = (): Output => {
    H.domain(/^[IVXLCDM]+(?![\s\S])/.test(numeral));
    return {
      text: overlined
        ? Array.from(numeral, (c) => c + "\u0305").join("")
        : numeral,
      multiplier: overlined ? 1000 : 1,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numeral: "XIV", overlined: true },
  output: { text: "X̅I̅V̅", multiplier: 1000 },
} satisfies ToolExample<Input, Output>;
export const romanNumeralOverlineMultiplierLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "format/roman-numeral-overline-multiplier-label",
      title: "Roman Numeral Overline Multiplier Label Tool",
      description:
        "Render a supplied Roman numeral token with a combining overline and explicit thousand multiplier.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          numeral: { type: "string", maxLength: 8192 },
          overlined: { type: "boolean" },
        },
        required: ["numeral", "overlined"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: { type: "string", maxLength: 8192 },
          multiplier: { type: "integer" },
        },
        required: ["text", "multiplier"],
      },
      ports: {
        inputs: [
          {
            id: "numeral",
            label: "Numeral",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "overlined",
            label: "Overlined",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "text", label: "Text", valueType: { type: "string" } },
          {
            id: "multiplier",
            label: "Multiplier",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = romanNumeralOverlineMultiplierLabelTool.execute;
export default romanNumeralOverlineMultiplierLabelTool;
