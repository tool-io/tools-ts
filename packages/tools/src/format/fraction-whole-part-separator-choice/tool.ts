import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wholePart: number;
  readonly numerator: number;
  readonly denominator: number;
  readonly separator: string;
};
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholePart: { type: "integer", minimum: 0 },
    numerator: { type: "integer", minimum: 0 },
    denominator: { type: "integer", minimum: 1 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["wholePart", "numerator", "denominator", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Format nonnegative mixed-fraction components with an explicit whole/fraction separator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wholePart, numerator, denominator, separator } = request;
  const compute = (): Output => {
    H.integer(wholePart, 0);
    H.integer(denominator, 1);
    H.integer(numerator, 0, denominator - 1);
    H.domain([" ", "\u00a0", "+"].includes(separator));
    return {
      formatted:
        wholePart === 0
          ? numerator + "/" + denominator
          : numerator === 0
            ? String(wholePart)
            : wholePart + separator + numerator + "/" + denominator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wholePart: 2, numerator: 1, denominator: 3, separator: " " },
  output: { formatted: "2 1/3" },
} satisfies ToolExample<Input, Output>;
export const fractionWholePartSeparatorChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/fraction-whole-part-separator-choice",
    title: "Fraction Whole Part Separator Choice Tool",
    description:
      "Format nonnegative mixed-fraction components with an explicit whole/fraction separator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholePart: { type: "integer", minimum: 0 },
        numerator: { type: "integer", minimum: 0 },
        denominator: { type: "integer", minimum: 1 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["wholePart", "numerator", "denominator", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formatted: { type: "string", maxLength: 8192 } },
      required: ["formatted"],
    },
    ports: {
      inputs: [
        {
          id: "wholePart",
          label: "Whole Part",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "formatted", label: "Formatted", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fractionWholePartSeparatorChoiceTool.execute;
export default fractionWholePartSeparatorChoiceTool;
