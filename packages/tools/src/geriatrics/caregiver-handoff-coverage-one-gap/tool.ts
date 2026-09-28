import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = {
  readonly overlap: number;
  readonly uncoveredGap: number;
  readonly coveredDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    uncoveredGap: { type: "number" },
    coveredDuration: { type: "number" },
  },
  required: ["overlap", "uncoveredGap", "coveredDuration"],
} as const;
/** Union coverage, overlap and internal gap of two supplied caregiver duty intervals; no staffing adequacy decision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart && secondEnd >= secondStart);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      uncoveredGap: Math.max(
        0,
        Math.max(firstStart, secondStart) - Math.min(firstEnd, secondEnd),
      ),
      coveredDuration:
        firstEnd -
        firstStart +
        secondEnd -
        secondStart -
        Math.max(
          0,
          Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 8, secondStart: 7, secondEnd: 12 },
  output: { overlap: 1, uncoveredGap: 0, coveredDuration: 12 },
} satisfies ToolExample<Input, Output>;
export const caregiverHandoffCoverageOneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/caregiver-handoff-coverage-one-gap",
    title: "Caregiver Handoff Coverage One Gap Tool",
    description:
      "Union coverage, overlap and internal gap of two supplied caregiver duty intervals; no staffing adequacy decision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number" },
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        secondEnd: { type: "number" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        uncoveredGap: { type: "number" },
        coveredDuration: { type: "number" },
      },
      required: ["overlap", "uncoveredGap", "coveredDuration"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "uncoveredGap",
          label: "Uncovered Gap",
          valueType: { type: "number" },
        },
        {
          id: "coveredDuration",
          label: "Covered Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverHandoffCoverageOneGapTool.execute;
export default caregiverHandoffCoverageOneGapTool;
