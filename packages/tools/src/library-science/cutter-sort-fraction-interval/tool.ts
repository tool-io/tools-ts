import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly digits: string };
export type Output = {
  readonly numerator: string;
  readonly denominator: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "string", maxLength: 8192 },
    denominator: { type: "string", maxLength: 8192 },
  },
  required: ["numerator", "denominator"],
} as const;
/** Represent a supplied Cutter numeric suffix as an exact decimal fraction without collapsing leading-zero order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { digits } = request;
  const compute = (): Output => {
    H.domain(/^\d{1,128}(?![\s\S])/.test(digits));
    return {
      numerator: BigInt(digits).toString(),
      denominator: (10n ** BigInt(digits.length)).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { digits: "025" },
  output: { numerator: "25", denominator: "1000" },
} satisfies ToolExample<Input, Output>;
export const cutterSortFractionIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "library-science/cutter-sort-fraction-interval",
    title: "Cutter Sort Fraction Interval Tool",
    description:
      "Represent a supplied Cutter numeric suffix as an exact decimal fraction without collapsing leading-zero order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { digits: { type: "string", maxLength: 8192 } },
      required: ["digits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "string", maxLength: 8192 },
        denominator: { type: "string", maxLength: 8192 },
      },
      required: ["numerator", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "digits",
          label: "Digits",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "numerator", label: "Numerator", valueType: { type: "string" } },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = cutterSortFractionIntervalTool.execute;
export default cutterSortFractionIntervalTool;
