import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outgoingEnd: number;
  readonly incomingStart: number;
};
export type Output = {
  readonly overlapDuration: number;
  readonly gapDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outgoingEnd: { type: "number" },
    incomingStart: { type: "number" },
  },
  required: ["outgoingEnd", "incomingStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDuration: { type: "number" },
    gapDuration: { type: "number" },
  },
  required: ["overlapDuration", "gapDuration"],
} as const;
/** Report supplied volunteer handover overlap or gap using shared monotonic timestamps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outgoingEnd, incomingStart } = request;
  const compute = (): Output => {
    return {
      overlapDuration: Math.max(0, outgoingEnd - incomingStart),
      gapDuration: Math.max(0, incomingStart - outgoingEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outgoingEnd: 12, incomingStart: 10 },
  output: { overlapDuration: 2, gapDuration: 0 },
} satisfies ToolExample<Input, Output>;
export const volunteerShiftHandoverOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/volunteer-shift-handover-overlap",
    title: "Volunteer Shift Handover Overlap",
    description:
      "Report supplied volunteer handover overlap or gap using shared monotonic timestamps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outgoingEnd: { type: "number" },
        incomingStart: { type: "number" },
      },
      required: ["outgoingEnd", "incomingStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDuration: { type: "number" },
        gapDuration: { type: "number" },
      },
      required: ["overlapDuration", "gapDuration"],
    },
    ports: {
      inputs: [
        {
          id: "outgoingEnd",
          label: "Outgoing End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomingStart",
          label: "Incoming Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        {
          id: "gapDuration",
          label: "Gap Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = volunteerShiftHandoverOverlapTool.execute;
export default volunteerShiftHandoverOverlapTool;
