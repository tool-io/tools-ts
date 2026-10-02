import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly numerator: number;
  readonly denominator: number;
};
export type Output = { readonly reversedRatio: number };
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
  properties: { reversedRatio: { type: "number" } },
  required: ["reversedRatio"],
} as const;
/** Calculate ratio component reversal from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { numerator, denominator } = request;
  const compute = (): Output => {
    H.domain(numerator !== 0 && denominator !== 0);
    return { reversedRatio: denominator / numerator };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { numerator: 2, denominator: 5 },
  output: { reversedRatio: 2.5 },
} satisfies ToolExample<Input, Output>;
export const ratioComponentReversalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/ratio-component-reversal",
    title: "Ratio Component Reversal Tool",
    description:
      "Calculate ratio component reversal from explicit caller-supplied inputs.",
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
      properties: { reversedRatio: { type: "number" } },
      required: ["reversedRatio"],
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
        {
          id: "reversedRatio",
          label: "Reversed Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratioComponentReversalTool.execute;
export default ratioComponentReversalTool;
