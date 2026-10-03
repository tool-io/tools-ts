import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly result: number;
  readonly limit: number;
  readonly upperLimit: boolean;
  readonly inclusive: boolean;
};
export type Output = { readonly margin: number; readonly passes: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    result: { type: "number" },
    limit: { type: "number" },
    upperLimit: { type: "boolean" },
    inclusive: { type: "boolean" },
  },
  required: ["result", "limit", "upperLimit", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { margin: { type: "number" }, passes: { type: "boolean" } },
  required: ["margin", "passes"],
} as const;
/** Evaluate one explicitly supplied specification side and equality convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { result, limit, upperLimit, inclusive } = request;
  const compute = (): Output => {
    return {
      margin: upperLimit ? limit - result : result - limit,
      passes: upperLimit
        ? inclusive
          ? result <= limit
          : result < limit
        : inclusive
          ? result >= limit
          : result > limit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { result: 9, limit: 10, upperLimit: true, inclusive: true },
  output: { margin: 1, passes: true },
} satisfies ToolExample<Input, Output>;
export const qcSpecificationOneSidedMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-specification-one-sided-margin",
    title: "QC Specification One Sided Margin Tool",
    description:
      "Evaluate one explicitly supplied specification side and equality convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        result: { type: "number" },
        limit: { type: "number" },
        upperLimit: { type: "boolean" },
        inclusive: { type: "boolean" },
      },
      required: ["result", "limit", "upperLimit", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { margin: { type: "number" }, passes: { type: "boolean" } },
      required: ["margin", "passes"],
    },
    ports: {
      inputs: [
        {
          id: "result",
          label: "Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "limit",
          label: "Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperLimit",
          label: "Upper Limit",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "passes", label: "Passes", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = qcSpecificationOneSidedMarginTool.execute;
export default qcSpecificationOneSidedMarginTool;
