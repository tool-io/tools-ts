import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly deadlineTime: number;
  readonly suppliedResponseClockOffset: number;
};
export type Output = {
  readonly normalizedResponse: number;
  readonly signedLateness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    deadlineTime: { type: "number" },
    suppliedResponseClockOffset: { type: "number" },
  },
  required: ["responseTime", "deadlineTime", "suppliedResponseClockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedResponse: { type: "number" },
    signedLateness: { type: "number" },
  },
  required: ["normalizedResponse", "signedLateness"],
} as const;
/** Compare supplied response/deadline clocks without selecting regulatory timelines or legal consequences. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseTime, deadlineTime, suppliedResponseClockOffset } = request;
  const compute = (): Output => {
    return {
      normalizedResponse: responseTime - suppliedResponseClockOffset,
      signedLateness: responseTime - suppliedResponseClockOffset - deadlineTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseTime: 120,
    deadlineTime: 100,
    suppliedResponseClockOffset: 5,
  },
  output: { normalizedResponse: 115, signedLateness: 15 },
} satisfies ToolExample<Input, Output>;
export const responseDeadlineClockOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/response-deadline-clock-offset",
    title: "Response Deadline Clock Offset Tool",
    description:
      "Compare supplied response/deadline clocks without selecting regulatory timelines or legal consequences.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        deadlineTime: { type: "number" },
        suppliedResponseClockOffset: { type: "number" },
      },
      required: ["responseTime", "deadlineTime", "suppliedResponseClockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedResponse: { type: "number" },
        signedLateness: { type: "number" },
      },
      required: ["normalizedResponse", "signedLateness"],
    },
    ports: {
      inputs: [
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadlineTime",
          label: "Deadline Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedResponseClockOffset",
          label: "Supplied Response Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedResponse",
          label: "Normalized Response",
          valueType: { type: "number" },
        },
        {
          id: "signedLateness",
          label: "Signed Lateness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = responseDeadlineClockOffsetTool.execute;
export default responseDeadlineClockOffsetTool;
