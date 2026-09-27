import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: string;
  readonly uncertaintyDigits: string;
  readonly decimals: number;
};
export type Output = { readonly text: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "string", maxLength: 8192 },
    uncertaintyDigits: { type: "string", maxLength: 8192 },
    decimals: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: ["value", "uncertaintyDigits", "decimals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { text: { type: "string", maxLength: 8192 } },
  required: ["text"],
} as const;
/** Attach uncertainty digits only when the value already has the explicitly declared decimal alignment. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, uncertaintyDigits, decimals } = input;
  const compute = (): Output => {
    H.integer(decimals, 0, 100);
    H.domain(
      /^\d+(?![\s\S])/.test(uncertaintyDigits) &&
        /^[+-]?\d+(?:\.\d+)?(?![\s\S])/.test(value),
    );
    const p = value.split(".");
    H.domain((p[1] ?? "").length === decimals);
    return { text: value + "(" + uncertaintyDigits + ")" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: "12.34", uncertaintyDigits: "5", decimals: 2 },
  output: { text: "12.34(5)" },
} satisfies ToolExample<Input, Output>;
export const uncertaintyDigitsAlignmentPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/uncertainty-digits-alignment-pair",
    title: "Uncertainty Digits Alignment Pair Tool",
    description:
      "Attach uncertainty digits only when the value already has the explicitly declared decimal alignment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "string", maxLength: 8192 },
        uncertaintyDigits: { type: "string", maxLength: 8192 },
        decimals: { type: "integer", minimum: 0, maximum: 100 },
      },
      required: ["value", "uncertaintyDigits", "decimals"],
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
          valueType: { type: "string" },
        },
        {
          id: "uncertaintyDigits",
          label: "Uncertainty Digits",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "decimals",
          label: "Decimals",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "text", label: "Text", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = uncertaintyDigitsAlignmentPairTool.execute;
export default uncertaintyDigitsAlignmentPairTool;
