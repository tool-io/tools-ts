import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly lambda: number };
export type Output = {
  readonly transformed: number;
  readonly zeroLimit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number", exclusiveMinimum: 0 },
    lambda: { type: "number" },
  },
  required: ["value", "lambda"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transformed: { type: "number" },
    zeroLimit: { type: "number" },
  },
  required: ["transformed", "zeroLimit"],
} as const;
/** Calculate boxcox lambda zero continuity bridge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lambda } = request;
  const compute = (): Output => {
    H.positive(value);
    const logarithm = Math.log(value);
    return {
      transformed:
        lambda === 0 ? logarithm : Math.expm1(lambda * logarithm) / lambda,
      zeroLimit: logarithm,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 4, lambda: 0 },
  output: { transformed: 1.3862943611198906, zeroLimit: 1.3862943611198906 },
} satisfies ToolExample<Input, Output>;
export const boxcoxLambdaZeroContinuityBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/boxcox-lambda-zero-continuity-bridge",
    title: "Boxcox Lambda Zero Continuity Bridge Tool",
    description:
      "Calculate boxcox lambda zero continuity bridge from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number", exclusiveMinimum: 0 },
        lambda: { type: "number" },
      },
      required: ["value", "lambda"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transformed: { type: "number" },
        zeroLimit: { type: "number" },
      },
      required: ["transformed", "zeroLimit"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lambda",
          label: "Lambda",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "transformed",
          label: "Transformed",
          valueType: { type: "number" },
        },
        { id: "zeroLimit", label: "Zero Limit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = boxcoxLambdaZeroContinuityBridgeTool.execute;
export default boxcoxLambdaZeroContinuityBridgeTool;
