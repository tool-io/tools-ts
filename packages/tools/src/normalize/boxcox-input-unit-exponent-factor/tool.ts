import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scaleFactor: number;
  readonly lambda: number;
  readonly transformed: number;
};
export type Output = {
  readonly multiplicativeFactor: number;
  readonly additiveShift: number;
  readonly scaledTransform: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scaleFactor: { type: "number", exclusiveMinimum: 0 },
    lambda: { type: "number" },
    transformed: { type: "number" },
  },
  required: ["scaleFactor", "lambda", "transformed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplicativeFactor: { type: "number" },
    additiveShift: { type: "number" },
    scaledTransform: { type: "number" },
  },
  required: ["multiplicativeFactor", "additiveShift", "scaledTransform"],
} as const;
/** Unit rescaling identity for the unnormalized Box-Cox transform, with the logarithmic lambda-zero limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scaleFactor, lambda, transformed } = request;
  const compute = (): Output => {
    H.positive(scaleFactor);
    return {
      multiplicativeFactor: scaleFactor ** lambda,
      additiveShift:
        lambda === 0
          ? Math.log(scaleFactor)
          : Math.expm1(lambda * Math.log(scaleFactor)) / lambda,
      scaledTransform:
        scaleFactor ** lambda * transformed +
        (lambda === 0
          ? Math.log(scaleFactor)
          : Math.expm1(lambda * Math.log(scaleFactor)) / lambda),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scaleFactor: 2, lambda: 1, transformed: 3 },
  output: { multiplicativeFactor: 2, additiveShift: 1, scaledTransform: 7 },
} satisfies ToolExample<Input, Output>;
export const boxcoxInputUnitExponentFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/boxcox-input-unit-exponent-factor",
    title: "Boxcox Input Unit Exponent Factor Tool",
    description:
      "Unit rescaling identity for the unnormalized Box-Cox transform, with the logarithmic lambda-zero limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scaleFactor: { type: "number", exclusiveMinimum: 0 },
        lambda: { type: "number" },
        transformed: { type: "number" },
      },
      required: ["scaleFactor", "lambda", "transformed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplicativeFactor: { type: "number" },
        additiveShift: { type: "number" },
        scaledTransform: { type: "number" },
      },
      required: ["multiplicativeFactor", "additiveShift", "scaledTransform"],
    },
    ports: {
      inputs: [
        {
          id: "scaleFactor",
          label: "Scale Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lambda",
          label: "Lambda",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transformed",
          label: "Transformed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "multiplicativeFactor",
          label: "Multiplicative Factor",
          valueType: { type: "number" },
        },
        {
          id: "additiveShift",
          label: "Additive Shift",
          valueType: { type: "number" },
        },
        {
          id: "scaledTransform",
          label: "Scaled Transform",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boxcoxInputUnitExponentFactorTool.execute;
export default boxcoxInputUnitExponentFactorTool;
