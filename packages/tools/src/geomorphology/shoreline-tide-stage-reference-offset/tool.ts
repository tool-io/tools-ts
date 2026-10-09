import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedShorelineCoordinate: number;
  readonly suppliedHorizontalTideOffset: number;
};
export type Output = { readonly referenceCoordinate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedShorelineCoordinate: { type: "number" },
    suppliedHorizontalTideOffset: { type: "number" },
  },
  required: ["observedShorelineCoordinate", "suppliedHorizontalTideOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referenceCoordinate: { type: "number" } },
  required: ["referenceCoordinate"],
} as const;
/** Remove an explicitly supplied signed horizontal tide-stage offset from a shoreline coordinate without estimating beach slope or water level. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedShorelineCoordinate, suppliedHorizontalTideOffset } = request;
  const compute = (): Output => {
    return {
      referenceCoordinate:
        observedShorelineCoordinate - suppliedHorizontalTideOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedShorelineCoordinate: 100, suppliedHorizontalTideOffset: 3 },
  output: { referenceCoordinate: 97 },
} satisfies ToolExample<Input, Output>;
export const shorelineTideStageReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/shoreline-tide-stage-reference-offset",
    title: "Shoreline Tide Stage Reference Offset Tool",
    description:
      "Remove an explicitly supplied signed horizontal tide-stage offset from a shoreline coordinate without estimating beach slope or water level.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedShorelineCoordinate: { type: "number" },
        suppliedHorizontalTideOffset: { type: "number" },
      },
      required: ["observedShorelineCoordinate", "suppliedHorizontalTideOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referenceCoordinate: { type: "number" } },
      required: ["referenceCoordinate"],
    },
    ports: {
      inputs: [
        {
          id: "observedShorelineCoordinate",
          label: "Observed Shoreline Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHorizontalTideOffset",
          label: "Supplied Horizontal Tide Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referenceCoordinate",
          label: "Reference Coordinate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shorelineTideStageReferenceOffsetTool.execute;
export default shorelineTideStageReferenceOffsetTool;
