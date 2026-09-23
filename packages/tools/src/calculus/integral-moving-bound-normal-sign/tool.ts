import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly lowerValue: number;
  readonly lowerVelocity: number;
  readonly upperValue: number;
  readonly upperVelocity: number;
};
export type Output = {
  readonly lowerTerm: number;
  readonly upperTerm: number;
  readonly derivative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerValue: { type: "number" },
    lowerVelocity: { type: "number" },
    upperValue: { type: "number" },
    upperVelocity: { type: "number" },
  },
  required: ["lowerValue", "lowerVelocity", "upperValue", "upperVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerTerm: { type: "number" },
    upperTerm: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["lowerTerm", "upperTerm", "derivative"],
} as const;
/** Compute integral moving bound normal sign from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { lowerValue, lowerVelocity, upperValue, upperVelocity } = input;
  const compute = (): Output => {
    const lowerTerm = -lowerValue * lowerVelocity,
      upperTerm = upperValue * upperVelocity;
    return { lowerTerm, upperTerm, derivative: lowerTerm + upperTerm };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lowerValue: 2, lowerVelocity: 3, upperValue: 4, upperVelocity: 5 },
  output: { lowerTerm: -6, upperTerm: 20, derivative: 14 },
} satisfies ToolExample<Input, Output>;
export const integralMovingBoundNormalSignTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "calculus/integral-moving-bound-normal-sign",
  title: "Integral Moving Bound Normal Sign Tool",
  description:
    "Compute integral moving bound normal sign from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lowerValue",
        label: "Lower Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "lowerVelocity",
        label: "Lower Velocity",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upperValue",
        label: "Upper Value",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "upperVelocity",
        label: "Upper Velocity",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "lowerTerm", label: "Lower Term", valueType: { type: "number" } },
      { id: "upperTerm", label: "Upper Term", valueType: { type: "number" } },
      { id: "derivative", label: "Derivative", valueType: { type: "number" } },
    ],
  },
});
export const run = integralMovingBoundNormalSignTool.execute;
export default integralMovingBoundNormalSignTool;
