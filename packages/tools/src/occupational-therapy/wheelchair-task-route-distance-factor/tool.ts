import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentLengths: readonly number[];
  readonly traversalCounts: readonly number[];
  readonly detourLength: number;
};
export type Output = {
  readonly directDistance: number;
  readonly traversedDistance: number;
  readonly detourFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentLengths: { type: "array", maxItems: 256, items: { type: "number" } },
    traversalCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    detourLength: { type: "number", minimum: 0 },
  },
  required: ["segmentLengths", "traversalCounts", "detourLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    directDistance: { type: "number" },
    traversedDistance: { type: "number" },
    detourFraction: { type: "number" },
  },
  required: ["directDistance", "traversedDistance", "detourFraction"],
} as const;
/** Calculate wheelchair task route distance factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentLengths, traversalCounts, detourLength } = request;
  const compute = (): Output => {
    H.sameLength(segmentLengths, traversalCounts);
    H.domain(
      segmentLengths.every((x) => x >= 0) &&
        traversalCounts.every((x) => x >= 0) &&
        detourLength >= 0 &&
        H.dot(segmentLengths, traversalCounts) + detourLength > 0,
    );
    return {
      directDistance: segmentLengths.reduce((a, b) => a + b, 0),
      traversedDistance: H.dot(segmentLengths, traversalCounts) + detourLength,
      detourFraction:
        detourLength / (H.dot(segmentLengths, traversalCounts) + detourLength),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentLengths: [10, 20], traversalCounts: [2, 1], detourLength: 5 },
  output: {
    directDistance: 30,
    traversedDistance: 45,
    detourFraction: 0.1111111111111111,
  },
} satisfies ToolExample<Input, Output>;
export const wheelchairTaskRouteDistanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/wheelchair-task-route-distance-factor",
    title: "Wheelchair Task Route Distance Factor Tool",
    description:
      "Calculate wheelchair task route distance factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentLengths: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        traversalCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        detourLength: { type: "number", minimum: 0 },
      },
      required: ["segmentLengths", "traversalCounts", "detourLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        directDistance: { type: "number" },
        traversedDistance: { type: "number" },
        detourFraction: { type: "number" },
      },
      required: ["directDistance", "traversedDistance", "detourFraction"],
    },
    ports: {
      inputs: [
        {
          id: "segmentLengths",
          label: "Segment Lengths",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "traversalCounts",
          label: "Traversal Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "detourLength",
          label: "Detour Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "directDistance",
          label: "Direct Distance",
          valueType: { type: "number" },
        },
        {
          id: "traversedDistance",
          label: "Traversed Distance",
          valueType: { type: "number" },
        },
        {
          id: "detourFraction",
          label: "Detour Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wheelchairTaskRouteDistanceFactorTool.execute;
export default wheelchairTaskRouteDistanceFactorTool;
