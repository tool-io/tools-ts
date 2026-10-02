import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
};
export type Output = { readonly defined: boolean; readonly proper: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    numerator: { type: "number" },
    denominator: { type: "number" },
  },
  required: ["numerator", "denominator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { defined: { type: "boolean" }, proper: { type: "boolean" } },
  required: ["defined", "proper"],
} as const;
/** Calculate ratio to fraction denominator domain from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { numerator, denominator } = input;
  const compute = (): Output => {
    return {
      defined: denominator !== 0,
      proper: denominator !== 0 && Math.abs(numerator) < Math.abs(denominator),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { numerator: 2, denominator: 3 },
  output: { defined: true, proper: true },
} satisfies ToolExample<Input, Output>;
export const ratioToFractionDenominatorDomainTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/ratio-to-fraction-denominator-domain",
    title: "Ratio To Fraction Denominator Domain Tool",
    description:
      "Calculate ratio to fraction denominator domain from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        numerator: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["numerator", "denominator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { defined: { type: "boolean" }, proper: { type: "boolean" } },
      required: ["defined", "proper"],
    },
    ports: {
      inputs: [
        {
          id: "numerator",
          label: "Numerator",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "denominator",
          label: "Denominator",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        { id: "proper", label: "Proper", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = ratioToFractionDenominatorDomainTool.execute;
export default ratioToFractionDenominatorDomainTool;
