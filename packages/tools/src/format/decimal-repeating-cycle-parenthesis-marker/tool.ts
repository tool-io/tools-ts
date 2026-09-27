import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integerPart: string;
  readonly nonrepeating: string;
  readonly repeating: string;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integerPart: { type: "string", maxLength: 8192 },
    nonrepeating: { type: "string", maxLength: 8192 },
    repeating: { type: "string", maxLength: 8192 },
  },
  required: ["integerPart", "nonrepeating", "repeating"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Join explicit decimal integer, nonrepeating and repeating digit tokens without expanding the fraction. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { integerPart, nonrepeating, repeating } = input;
  const compute = (): Output => {
    H.domain(
      /^-?\d+(?![\s\S])/.test(integerPart) &&
        /^\d*(?![\s\S])/.test(nonrepeating) &&
        /^\d+(?![\s\S])/.test(repeating),
    );
    return { text: integerPart + "." + nonrepeating + "(" + repeating + ")" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { integerPart: "0", nonrepeating: "", repeating: "3" },
  output: { text: "0.(3)" },
} satisfies ToolExample<Input, Output>;
export const decimalRepeatingCycleParenthesisMarkerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "format/decimal-repeating-cycle-parenthesis-marker",
      title: "Decimal Repeating Cycle Parenthesis Marker Tool",
      description:
        "Join explicit decimal integer, nonrepeating and repeating digit tokens without expanding the fraction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          integerPart: { type: "string", maxLength: 8192 },
          nonrepeating: { type: "string", maxLength: 8192 },
          repeating: { type: "string", maxLength: 8192 },
        },
        required: ["integerPart", "nonrepeating", "repeating"],
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
            id: "integerPart",
            label: "Integer Part",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "nonrepeating",
            label: "Nonrepeating",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "repeating",
            label: "Repeating",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = decimalRepeatingCycleParenthesisMarkerTool.execute;
export default decimalRepeatingCycleParenthesisMarkerTool;
