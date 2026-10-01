import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly value: number; readonly epsilon: number };
export type Output = { readonly clamped: number; readonly distance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    epsilon: { type: "number", minimum: 0, exclusiveMaximum: 0.5 },
  },
  required: ["value", "epsilon"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clamped: { type: "number" }, distance: { type: "number" } },
  required: ["clamped", "distance"],
} as const;
/** Calculate unit interval epsilon clamp distance from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { value, epsilon } = input;
  const compute = (): Output => {
    H.domain(epsilon >= 0 && epsilon < 0.5);
    const clamped = Math.max(epsilon, Math.min(1 - epsilon, value));
    return { clamped, distance: Math.abs(value - clamped) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { value: 0, epsilon: 0.125 },
  output: { clamped: 0.125, distance: 0.125 },
} satisfies ToolExample<Input, Output>;
export const unitIntervalEpsilonClampDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/unit-interval-epsilon-clamp-distance",
    title: "Unit Interval Epsilon Clamp Distance Tool",
    description:
      "Calculate unit interval epsilon clamp distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        epsilon: { type: "number", minimum: 0, exclusiveMaximum: 0.5 },
      },
      required: ["value", "epsilon"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clamped: { type: "number" }, distance: { type: "number" } },
      required: ["clamped", "distance"],
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
          id: "epsilon",
          label: "Epsilon",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clamped", label: "Clamped", valueType: { type: "number" } },
        { id: "distance", label: "Distance", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = unitIntervalEpsilonClampDistanceTool.execute;
export default unitIntervalEpsilonClampDistanceTool;
