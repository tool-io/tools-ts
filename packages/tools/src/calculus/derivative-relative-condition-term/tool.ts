import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly functionValue: number;
  readonly derivative: number;
};
export type Output = {
  readonly signedRelativeSensitivity: number;
  readonly absoluteCondition: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    functionValue: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["x", "functionValue", "derivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedRelativeSensitivity: { type: "number" },
    absoluteCondition: { type: "number" },
  },
  required: ["signedRelativeSensitivity", "absoluteCondition"],
} as const;
/** Calculate derivative relative condition term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, functionValue, derivative } = request;
  const compute = (): Output => {
    H.domain(functionValue !== 0);
    return {
      signedRelativeSensitivity: (x * derivative) / functionValue,
      absoluteCondition: Math.abs((x * derivative) / functionValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 2, functionValue: 4, derivative: 4 },
  output: { signedRelativeSensitivity: 2, absoluteCondition: 2 },
} satisfies ToolExample<Input, Output>;
export const derivativeRelativeConditionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/derivative-relative-condition-term",
    title: "Derivative Relative Condition Term Tool",
    description:
      "Calculate derivative relative condition term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        functionValue: { type: "number" },
        derivative: { type: "number" },
      },
      required: ["x", "functionValue", "derivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedRelativeSensitivity: { type: "number" },
        absoluteCondition: { type: "number" },
      },
      required: ["signedRelativeSensitivity", "absoluteCondition"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "functionValue",
          label: "Function Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "derivative",
          label: "Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedRelativeSensitivity",
          label: "Signed Relative Sensitivity",
          valueType: { type: "number" },
        },
        {
          id: "absoluteCondition",
          label: "Absolute Condition",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = derivativeRelativeConditionTermTool.execute;
export default derivativeRelativeConditionTermTool;
