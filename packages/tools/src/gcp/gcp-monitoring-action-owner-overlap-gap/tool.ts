import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOwner: string;
  readonly secondOwner: string;
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = {
  readonly sameOwner: boolean;
  readonly overlap: number;
  readonly uncoveredGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOwner: { type: "string", maxLength: 8192 },
    secondOwner: { type: "string", maxLength: 8192 },
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
  },
  required: [
    "firstOwner",
    "secondOwner",
    "firstStart",
    "firstEnd",
    "secondStart",
    "secondEnd",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameOwner: { type: "boolean" },
    overlap: { type: "number" },
    uncoveredGap: { type: "number" },
  },
  required: ["sameOwner", "overlap", "uncoveredGap"],
} as const;
/** Audit explicit action-ownership intervals for overlap or handoff gaps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstOwner,
    secondOwner,
    firstStart,
    firstEnd,
    secondStart,
    secondEnd,
  } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart && secondEnd >= secondStart);
    return {
      sameOwner: firstOwner === secondOwner,
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
      uncoveredGap: Math.max(
        0,
        Math.max(firstStart, secondStart) - Math.min(firstEnd, secondEnd),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstOwner: "A",
    secondOwner: "B",
    firstStart: 0,
    firstEnd: 10,
    secondStart: 8,
    secondEnd: 20,
  },
  output: { sameOwner: false, overlap: 2, uncoveredGap: 0 },
} satisfies ToolExample<Input, Output>;
export const gcpMonitoringActionOwnerOverlapGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-monitoring-action-owner-overlap-gap",
    title: "GCP Monitoring Action Owner Overlap Gap Tool",
    description:
      "Audit explicit action-ownership intervals for overlap or handoff gaps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOwner: { type: "string", maxLength: 8192 },
        secondOwner: { type: "string", maxLength: 8192 },
        firstStart: { type: "number" },
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        secondEnd: { type: "number" },
      },
      required: [
        "firstOwner",
        "secondOwner",
        "firstStart",
        "firstEnd",
        "secondStart",
        "secondEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sameOwner: { type: "boolean" },
        overlap: { type: "number" },
        uncoveredGap: { type: "number" },
      },
      required: ["sameOwner", "overlap", "uncoveredGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstOwner",
          label: "First Owner",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondOwner",
          label: "Second Owner",
          required: true,
          valueType: { type: "string" },
        },
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
        {
          id: "sameOwner",
          label: "Same Owner",
          valueType: { type: "boolean" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        {
          id: "uncoveredGap",
          label: "Uncovered Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpMonitoringActionOwnerOverlapGapTool.execute;
export default gcpMonitoringActionOwnerOverlapGapTool;
