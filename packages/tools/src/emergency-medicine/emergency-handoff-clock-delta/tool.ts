import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sendingClockSeconds: number;
  readonly receivingClockSeconds: number;
  readonly suppliedClockOffsetSeconds: number;
};
export type Output = { readonly correctedHandoffGapSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sendingClockSeconds: { type: "number" },
    receivingClockSeconds: { type: "number" },
    suppliedClockOffsetSeconds: { type: "number" },
  },
  required: [
    "sendingClockSeconds",
    "receivingClockSeconds",
    "suppliedClockOffsetSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedHandoffGapSeconds: { type: "number" } },
  required: ["correctedHandoffGapSeconds"],
} as const;
/** Compare recorded emergency-handoff clock readings after an explicit receiving-minus-sending clock offset correction without assessing care timeliness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sendingClockSeconds,
    receivingClockSeconds,
    suppliedClockOffsetSeconds,
  } = request;
  const compute = (): Output => {
    return {
      correctedHandoffGapSeconds:
        receivingClockSeconds -
        suppliedClockOffsetSeconds -
        sendingClockSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sendingClockSeconds: 1000,
    receivingClockSeconds: 1030,
    suppliedClockOffsetSeconds: 5,
  },
  output: { correctedHandoffGapSeconds: 25 },
} satisfies ToolExample<Input, Output>;
export const emergencyHandoffClockDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "emergency-medicine",
        "emergency medicine",
        "health and medicine",
      ],
      keywords: ["emergency medicine", "health and medicine"],
    },
    id: "emergency-medicine/emergency-handoff-clock-delta",
    title: "Emergency Handoff Clock Delta",
    description:
      "Compare recorded emergency-handoff clock readings after an explicit receiving-minus-sending clock offset correction without assessing care timeliness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sendingClockSeconds: { type: "number" },
        receivingClockSeconds: { type: "number" },
        suppliedClockOffsetSeconds: { type: "number" },
      },
      required: [
        "sendingClockSeconds",
        "receivingClockSeconds",
        "suppliedClockOffsetSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedHandoffGapSeconds: { type: "number" } },
      required: ["correctedHandoffGapSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sendingClockSeconds",
          label: "Sending Clock Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivingClockSeconds",
          label: "Receiving Clock Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedClockOffsetSeconds",
          label: "Supplied Clock Offset Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedHandoffGapSeconds",
          label: "Corrected Handoff Gap Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = emergencyHandoffClockDeltaTool.execute;
export default emergencyHandoffClockDeltaTool;
