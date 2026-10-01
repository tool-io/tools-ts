import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reachCoordinate: number;
  readonly originShift: number;
  readonly boundaryCoordinate: number;
};
export type Output = {
  readonly newCoordinate: number;
  readonly remainingMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reachCoordinate: { type: "number" },
    originShift: { type: "number" },
    boundaryCoordinate: { type: "number" },
  },
  required: ["reachCoordinate", "originShift", "boundaryCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newCoordinate: { type: "number" },
    remainingMargin: { type: "number" },
  },
  required: ["newCoordinate", "remainingMargin"],
} as const;
/** Translate one supplied reach-space coordinate and compare to a supplied boundary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reachCoordinate, originShift, boundaryCoordinate } = request;
  const compute = (): Output => {
    return {
      newCoordinate: reachCoordinate - originShift,
      remainingMargin: boundaryCoordinate - (reachCoordinate - originShift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reachCoordinate: 20, originShift: 5, boundaryCoordinate: 30 },
  output: { newCoordinate: 15, remainingMargin: 15 },
} satisfies ToolExample<Input, Output>;
export const reachSpaceOriginShiftBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-therapy/reach-space-origin-shift-budget",
    title: "Reach Space Origin Shift Budget Tool",
    description:
      "Translate one supplied reach-space coordinate and compare to a supplied boundary.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reachCoordinate: { type: "number" },
        originShift: { type: "number" },
        boundaryCoordinate: { type: "number" },
      },
      required: ["reachCoordinate", "originShift", "boundaryCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newCoordinate: { type: "number" },
        remainingMargin: { type: "number" },
      },
      required: ["newCoordinate", "remainingMargin"],
    },
    ports: {
      inputs: [
        {
          id: "reachCoordinate",
          label: "Reach Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originShift",
          label: "Origin Shift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundaryCoordinate",
          label: "Boundary Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "newCoordinate",
          label: "New Coordinate",
          valueType: { type: "number" },
        },
        {
          id: "remainingMargin",
          label: "Remaining Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reachSpaceOriginShiftBudgetTool.execute;
export default reachSpaceOriginShiftBudgetTool;
