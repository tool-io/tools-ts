import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldStart: number;
  readonly oldEnd: number;
  readonly newStart: number;
  readonly newEnd: number;
};
export type Output = { readonly overlapDays: number; readonly gapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldStart: { type: "integer" },
    oldEnd: { type: "integer" },
    newStart: { type: "integer" },
    newEnd: { type: "integer" },
  },
  required: ["oldStart", "oldEnd", "newStart", "newEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDays: { type: "integer" },
    gapDays: { type: "integer" },
  },
  required: ["overlapDays", "gapDays"],
} as const;
/** Half-open residence-record overlap/gap, without inferring legal residence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldStart, oldEnd, newStart, newEnd } = request;
  const compute = (): Output => {
    H.domain(oldEnd >= oldStart && newEnd >= newStart);
    return {
      overlapDays: Math.max(
        0,
        Math.min(oldEnd, newEnd) - Math.max(oldStart, newStart),
      ),
      gapDays: Math.max(0, newStart - oldEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldStart: 0, oldEnd: 20, newStart: 15, newEnd: 30 },
  output: { overlapDays: 5, gapDays: 0 },
} satisfies ToolExample<Input, Output>;
export const residenceMoveOverlapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/residence-move-overlap-gap",
    title: "Residence Move Overlap Gap Tool",
    description:
      "Half-open residence-record overlap/gap, without inferring legal residence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldStart: { type: "integer" },
        oldEnd: { type: "integer" },
        newStart: { type: "integer" },
        newEnd: { type: "integer" },
      },
      required: ["oldStart", "oldEnd", "newStart", "newEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDays: { type: "integer" },
        gapDays: { type: "integer" },
      },
      required: ["overlapDays", "gapDays"],
    },
    ports: {
      inputs: [
        {
          id: "oldStart",
          label: "Old Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "oldEnd",
          label: "Old End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newStart",
          label: "New Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "newEnd",
          label: "New End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "overlapDays",
          label: "Overlap Days",
          valueType: { type: "integer" },
        },
        { id: "gapDays", label: "Gap Days", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = residenceMoveOverlapGapTool.execute;
export default residenceMoveOverlapGapTool;
