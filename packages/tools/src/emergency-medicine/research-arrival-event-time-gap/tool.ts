import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrivalTime: number;
  readonly eventTime: number;
  readonly suppliedEventOffset: number;
};
export type Output = {
  readonly signedGap: number;
  readonly eventBeforeArrival: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrivalTime: { type: "number" },
    eventTime: { type: "number" },
    suppliedEventOffset: { type: "number" },
  },
  required: ["arrivalTime", "eventTime", "suppliedEventOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    eventBeforeArrival: { type: "boolean" },
  },
  required: ["signedGap", "eventBeforeArrival"],
} as const;
/** Compare supplied deidentified research event clocks without clinical urgency or treatment interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrivalTime, eventTime, suppliedEventOffset } = request;
  const compute = (): Output => {
    return {
      signedGap: eventTime - suppliedEventOffset - arrivalTime,
      eventBeforeArrival: eventTime - suppliedEventOffset < arrivalTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrivalTime: 100, eventTime: 130, suppliedEventOffset: 5 },
  output: { signedGap: 25, eventBeforeArrival: false },
} satisfies ToolExample<Input, Output>;
export const researchArrivalEventTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/research-arrival-event-time-gap",
    title: "Research Arrival Event Time Gap Tool",
    description:
      "Compare supplied deidentified research event clocks without clinical urgency or treatment interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrivalTime: { type: "number" },
        eventTime: { type: "number" },
        suppliedEventOffset: { type: "number" },
      },
      required: ["arrivalTime", "eventTime", "suppliedEventOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        eventBeforeArrival: { type: "boolean" },
      },
      required: ["signedGap", "eventBeforeArrival"],
    },
    ports: {
      inputs: [
        {
          id: "arrivalTime",
          label: "Arrival Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEventOffset",
          label: "Supplied Event Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "eventBeforeArrival",
          label: "Event Before Arrival",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchArrivalEventTimeGapTool.execute;
export default researchArrivalEventTimeGapTool;
