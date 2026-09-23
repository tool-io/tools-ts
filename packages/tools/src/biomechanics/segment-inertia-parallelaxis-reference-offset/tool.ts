import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerInertia: number;
  readonly mass: number;
  readonly distance: number;
};
export type Output = {
  readonly parallelAxisTerm: number;
  readonly shiftedInertia: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerInertia: { type: "number", minimum: 0 },
    mass: { type: "number", minimum: 0 },
    distance: { type: "number", minimum: 0 },
  },
  required: ["centerInertia", "mass", "distance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parallelAxisTerm: { type: "number" },
    shiftedInertia: { type: "number" },
  },
  required: ["parallelAxisTerm", "shiftedInertia"],
} as const;
/** Calculate segment inertia parallelaxis reference offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerInertia, mass, distance } = request;
  const compute = (): Output => {
    H.domain(centerInertia >= 0 && mass >= 0 && distance >= 0);
    return {
      parallelAxisTerm: mass * distance ** 2,
      shiftedInertia: centerInertia + mass * distance ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerInertia: 2, mass: 3, distance: 4 },
  output: { parallelAxisTerm: 48, shiftedInertia: 50 },
} satisfies ToolExample<Input, Output>;
export const segmentInertiaParallelaxisReferenceOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomechanics/segment-inertia-parallelaxis-reference-offset",
      title: "Segment Inertia Parallelaxis Reference Offset Tool",
      description:
        "Calculate segment inertia parallelaxis reference offset from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centerInertia: { type: "number", minimum: 0 },
          mass: { type: "number", minimum: 0 },
          distance: { type: "number", minimum: 0 },
        },
        required: ["centerInertia", "mass", "distance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parallelAxisTerm: { type: "number" },
          shiftedInertia: { type: "number" },
        },
        required: ["parallelAxisTerm", "shiftedInertia"],
      },
      ports: {
        inputs: [
          {
            id: "centerInertia",
            label: "Center Inertia",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "parallelAxisTerm",
            label: "Parallel Axis Term",
            valueType: { type: "number" },
          },
          {
            id: "shiftedInertia",
            label: "Shifted Inertia",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = segmentInertiaParallelaxisReferenceOffsetTool.execute;
export default segmentInertiaParallelaxisReferenceOffsetTool;
