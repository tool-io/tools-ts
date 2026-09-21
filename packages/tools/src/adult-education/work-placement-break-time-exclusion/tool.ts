import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly unpaidBreak: number;
  readonly overlappingBreak: number;
  readonly supervisedBreak: number;
  readonly excludeSupervised: boolean;
};
export type Output = { readonly counted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "number", minimum: 0 },
    unpaidBreak: { type: "number", minimum: 0 },
    overlappingBreak: { type: "number", minimum: 0 },
    supervisedBreak: { type: "number", minimum: 0 },
    excludeSupervised: { type: "boolean" },
  },
  required: [
    "scheduled",
    "unpaidBreak",
    "overlappingBreak",
    "supervisedBreak",
    "excludeSupervised",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { counted: { type: "number" } },
  required: ["counted"],
} as const;
/** Explicit break-union accounting; overlappingBreak is deducted twice only when both break categories are excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    scheduled,
    unpaidBreak,
    overlappingBreak,
    supervisedBreak,
    excludeSupervised,
  } = request;
  const compute = (): Output => {
    H.domain(
      scheduled >= 0 &&
        unpaidBreak >= 0 &&
        supervisedBreak >= 0 &&
        overlappingBreak >= 0 &&
        overlappingBreak <= Math.min(unpaidBreak, supervisedBreak) &&
        unpaidBreak + supervisedBreak - overlappingBreak <= scheduled,
    );
    return {
      counted:
        scheduled -
        unpaidBreak -
        (excludeSupervised ? supervisedBreak - overlappingBreak : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduled: 8,
    unpaidBreak: 1,
    overlappingBreak: 0.25,
    supervisedBreak: 0.5,
    excludeSupervised: true,
  },
  output: { counted: 6.75 },
} satisfies ToolExample<Input, Output>;
export const workPlacementBreakTimeExclusionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "adult-education/work-placement-break-time-exclusion",
    title: "Work Placement Break Time Exclusion Tool",
    description:
      "Explicit break-union accounting; overlappingBreak is deducted twice only when both break categories are excluded.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduled: { type: "number", minimum: 0 },
        unpaidBreak: { type: "number", minimum: 0 },
        overlappingBreak: { type: "number", minimum: 0 },
        supervisedBreak: { type: "number", minimum: 0 },
        excludeSupervised: { type: "boolean" },
      },
      required: [
        "scheduled",
        "unpaidBreak",
        "overlappingBreak",
        "supervisedBreak",
        "excludeSupervised",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { counted: { type: "number" } },
      required: ["counted"],
    },
    ports: {
      inputs: [
        {
          id: "scheduled",
          label: "Scheduled",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unpaidBreak",
          label: "Unpaid Break",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlappingBreak",
          label: "Overlapping Break",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supervisedBreak",
          label: "Supervised Break",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludeSupervised",
          label: "Exclude Supervised",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "counted", label: "Counted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = workPlacementBreakTimeExclusionTool.execute;
export default workPlacementBreakTimeExclusionTool;
