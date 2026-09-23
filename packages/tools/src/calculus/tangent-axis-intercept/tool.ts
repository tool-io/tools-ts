import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly derivative: number;
};
export type Output = {
  readonly xIntercept: number;
  readonly yIntercept: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    derivative: { type: "number" },
  },
  required: ["x", "y", "derivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    xIntercept: { type: "number" },
    yIntercept: { type: "number" },
  },
  required: ["xIntercept", "yIntercept"],
} as const;
/** Calculate tangent axis intercept from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, derivative } = request;
  const compute = (): Output => {
    H.domain(derivative !== 0);
    return { xIntercept: x - y / derivative, yIntercept: y - derivative * x };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 2, y: 4, derivative: 4 },
  output: { xIntercept: 1, yIntercept: -4 },
} satisfies ToolExample<Input, Output>;
export const tangentAxisInterceptTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/tangent-axis-intercept",
    title: "Tangent Axis Intercept Tool",
    description:
      "Calculate tangent axis intercept from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        derivative: { type: "number" },
      },
      required: ["x", "y", "derivative"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        xIntercept: { type: "number" },
        yIntercept: { type: "number" },
      },
      required: ["xIntercept", "yIntercept"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        {
          id: "derivative",
          label: "Derivative",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "xIntercept",
          label: "X Intercept",
          valueType: { type: "number" },
        },
        {
          id: "yIntercept",
          label: "Y Intercept",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tangentAxisInterceptTool.execute;
export default tangentAxisInterceptTool;
