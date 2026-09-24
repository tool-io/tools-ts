import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly period: number;
};
export type Output = {
  readonly signedDisplacement: number;
  readonly distance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "number" },
    second: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["first", "second", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDisplacement: { type: "number" },
    distance: { type: "number" },
  },
  required: ["signedDisplacement", "distance"],
} as const;
/** One-axis minimum image in [-period/2,period/2); exact half-period ties select the negative image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second, period } = request;
  const compute = (): Output => {
    H.positive(period);
    return {
      signedDisplacement:
        H.mod(second - first + period / 2, period) - period / 2,
      distance: Math.abs(
        H.mod(second - first + period / 2, period) - period / 2,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 9, second: 1, period: 10 },
  output: { signedDisplacement: 2, distance: 2 },
} satisfies ToolExample<Input, Output>;
export const periodicBoundaryTwoImageDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/periodic-boundary-two-image-distance",
    title: "Periodic Boundary Two Image Distance Tool",
    description:
      "One-axis minimum image in [-period/2,period/2); exact half-period ties select the negative image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "number" },
        second: { type: "number" },
        period: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["first", "second", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDisplacement: { type: "number" },
        distance: { type: "number" },
      },
      required: ["signedDisplacement", "distance"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDisplacement",
          label: "Signed Displacement",
          valueType: { type: "number" },
        },
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = periodicBoundaryTwoImageDistanceTool.execute;
export default periodicBoundaryTwoImageDistanceTool;
