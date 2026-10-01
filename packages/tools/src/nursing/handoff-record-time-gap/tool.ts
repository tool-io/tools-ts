import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outgoingRecordTime: number;
  readonly incomingRecordTime: number;
  readonly suppliedClockOffset: number;
};
export type Output = { readonly gap: number; readonly overlap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outgoingRecordTime: { type: "number" },
    incomingRecordTime: { type: "number" },
    suppliedClockOffset: { type: "number" },
  },
  required: ["outgoingRecordTime", "incomingRecordTime", "suppliedClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
  required: ["gap", "overlap"],
} as const;
/** Compare supplied administrative handoff clocks without judging clinical continuity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outgoingRecordTime, incomingRecordTime, suppliedClockOffset } =
    request;
  const compute = (): Output => {
    return {
      gap: incomingRecordTime - suppliedClockOffset - outgoingRecordTime,
      overlap: incomingRecordTime - suppliedClockOffset < outgoingRecordTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outgoingRecordTime: 100,
    incomingRecordTime: 120,
    suppliedClockOffset: 5,
  },
  output: { gap: 15, overlap: false },
} satisfies ToolExample<Input, Output>;
export const handoffRecordTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/handoff-record-time-gap",
    title: "Handoff Record Time Gap Tool",
    description:
      "Compare supplied administrative handoff clocks without judging clinical continuity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outgoingRecordTime: { type: "number" },
        incomingRecordTime: { type: "number" },
        suppliedClockOffset: { type: "number" },
      },
      required: [
        "outgoingRecordTime",
        "incomingRecordTime",
        "suppliedClockOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
      required: ["gap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "outgoingRecordTime",
          label: "Outgoing Record Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "incomingRecordTime",
          label: "Incoming Record Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffset",
          label: "Supplied Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = handoffRecordTimeGapTool.execute;
export default handoffRecordTimeGapTool;
