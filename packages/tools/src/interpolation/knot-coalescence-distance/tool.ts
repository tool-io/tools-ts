import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstKnot: number;
  readonly secondKnot: number;
  readonly tolerance: number;
  readonly equalityCoalesces: boolean;
};
export type Output = { readonly distance: number; readonly coalesces: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstKnot: { type: "number" },
    secondKnot: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
    equalityCoalesces: { type: "boolean" },
  },
  required: ["firstKnot", "secondKnot", "tolerance", "equalityCoalesces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, coalesces: { type: "boolean" } },
  required: ["distance", "coalesces"],
} as const;
/** Calculate knot coalescence distance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstKnot, secondKnot, tolerance, equalityCoalesces } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      distance: Math.abs(secondKnot - firstKnot),
      coalesces: equalityCoalesces
        ? Math.abs(secondKnot - firstKnot) <= tolerance
        : Math.abs(secondKnot - firstKnot) < tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstKnot: 1,
    secondKnot: 1.5,
    tolerance: 0.5,
    equalityCoalesces: true,
  },
  output: { distance: 0.5, coalesces: true },
} satisfies ToolExample<Input, Output>;
export const knotCoalescenceDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/knot-coalescence-distance",
    title: "Knot Coalescence Distance Tool",
    description:
      "Calculate knot coalescence distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstKnot: { type: "number" },
        secondKnot: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
        equalityCoalesces: { type: "boolean" },
      },
      required: ["firstKnot", "secondKnot", "tolerance", "equalityCoalesces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        coalesces: { type: "boolean" },
      },
      required: ["distance", "coalesces"],
    },
    ports: {
      inputs: [
        {
          id: "firstKnot",
          label: "First Knot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondKnot",
          label: "Second Knot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityCoalesces",
          label: "Equality Coalesces",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        { id: "coalesces", label: "Coalesces", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = knotCoalescenceDistanceTool.execute;
export default knotCoalescenceDistanceTool;
