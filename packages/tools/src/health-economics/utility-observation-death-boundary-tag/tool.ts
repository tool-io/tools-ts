import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationTime: number;
  readonly suppliedDeathTime: number;
  readonly boundaryCountsAsAfter: boolean;
};
export type Output = { readonly afterBoundary: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationTime: { type: "number" },
    suppliedDeathTime: { type: "number" },
    boundaryCountsAsAfter: { type: "boolean" },
  },
  required: ["observationTime", "suppliedDeathTime", "boundaryCountsAsAfter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { afterBoundary: { type: "boolean" } },
  required: ["afterBoundary"],
} as const;
/** Classify supplied utility-observation timing against an explicit death-time boundary policy without assigning utility values or vital status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationTime, suppliedDeathTime, boundaryCountsAsAfter } = request;
  const compute = (): Output => {
    return {
      afterBoundary:
        observationTime > suppliedDeathTime ||
        (boundaryCountsAsAfter && observationTime === suppliedDeathTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationTime: 10,
    suppliedDeathTime: 10,
    boundaryCountsAsAfter: true,
  },
  output: { afterBoundary: true },
} satisfies ToolExample<Input, Output>;
export const utilityObservationDeathBoundaryTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/utility-observation-death-boundary-tag",
    title: "Utility Observation Death Boundary Tag Tool",
    description:
      "Classify supplied utility-observation timing against an explicit death-time boundary policy without assigning utility values or vital status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationTime: { type: "number" },
        suppliedDeathTime: { type: "number" },
        boundaryCountsAsAfter: { type: "boolean" },
      },
      required: [
        "observationTime",
        "suppliedDeathTime",
        "boundaryCountsAsAfter",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { afterBoundary: { type: "boolean" } },
      required: ["afterBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "observationTime",
          label: "Observation Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDeathTime",
          label: "Supplied Death Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryCountsAsAfter",
          label: "Boundary Counts As After",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "afterBoundary",
          label: "After Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = utilityObservationDeathBoundaryTagTool.execute;
export default utilityObservationDeathBoundaryTagTool;
