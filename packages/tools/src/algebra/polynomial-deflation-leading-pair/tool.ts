import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leading: number;
  readonly next: number;
  readonly root: number;
};
export type Output = {
  readonly quotientLeading: number;
  readonly quotientNext: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leading: { type: "number" },
    next: { type: "number" },
    root: { type: "number" },
  },
  required: ["leading", "next", "root"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotientLeading: { type: "number" },
    quotientNext: { type: "number" },
  },
  required: ["quotientLeading", "quotientNext"],
} as const;
/** Calculate polynomial deflation leading pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leading, next, root } = input;
  const compute = (): Output => {
    H.domain(leading !== 0);
    return { quotientLeading: leading, quotientNext: next + root * leading };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leading: 2, next: 3, root: 4 },
  output: { quotientLeading: 2, quotientNext: 11 },
} satisfies ToolExample<Input, Output>;
export const polynomialDeflationLeadingPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/polynomial-deflation-leading-pair",
    title: "Polynomial Deflation Leading Pair Tool",
    description:
      "Calculate polynomial deflation leading pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leading: { type: "number" },
        next: { type: "number" },
        root: { type: "number" },
      },
      required: ["leading", "next", "root"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotientLeading: { type: "number" },
        quotientNext: { type: "number" },
      },
      required: ["quotientLeading", "quotientNext"],
    },
    ports: {
      inputs: [
        {
          id: "leading",
          label: "Leading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "next",
          label: "Next",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "root",
          label: "Root",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "quotientLeading",
          label: "Quotient Leading",
          valueType: { type: "number" },
        },
        {
          id: "quotientNext",
          label: "Quotient Next",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = polynomialDeflationLeadingPairTool.execute;
export default polynomialDeflationLeadingPairTool;
