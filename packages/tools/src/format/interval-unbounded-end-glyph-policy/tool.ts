import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: string;
  readonly upper: string;
  readonly lowerUnbounded: boolean;
  readonly upperUnbounded: boolean;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "string", maxLength: 8192 },
    upper: { type: "string", maxLength: 8192 },
    lowerUnbounded: { type: "boolean" },
    upperUnbounded: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerUnbounded", "upperUnbounded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Render a closed finite endpoint interval with open infinity endpoints controlled by explicit flags. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { lower, upper, lowerUnbounded, upperUnbounded } = input;
  const compute = (): Output => {
    return {
      text:
        (lowerUnbounded ? "(-∞" : "[" + lower) +
        ", " +
        (upperUnbounded ? "∞)" : upper + "]"),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    lower: "0",
    upper: "10",
    lowerUnbounded: true,
    upperUnbounded: false,
  },
  output: { text: "(-∞, 10]" },
} satisfies ToolExample<Input, Output>;
export const intervalUnboundedEndGlyphPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/interval-unbounded-end-glyph-policy",
    title: "Interval Unbounded End Glyph Policy Tool",
    description:
      "Render a closed finite endpoint interval with open infinity endpoints controlled by explicit flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "string", maxLength: 8192 },
        upper: { type: "string", maxLength: 8192 },
        lowerUnbounded: { type: "boolean" },
        upperUnbounded: { type: "boolean" },
      },
      required: ["lower", "upper", "lowerUnbounded", "upperUnbounded"],
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
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lowerUnbounded",
          label: "Lower Unbounded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperUnbounded",
          label: "Upper Unbounded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = intervalUnboundedEndGlyphPolicyTool.execute;
export default intervalUnboundedEndGlyphPolicyTool;
