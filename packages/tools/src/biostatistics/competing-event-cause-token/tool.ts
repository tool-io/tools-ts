import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly eventId: string;
  readonly suppliedCauseCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    eventId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCauseCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "eventId", "suppliedCauseCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit competing-event cause code without inferring causal or clinical classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, eventId, suppliedCauseCode } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(eventId.length > 0, "eventId");
    H.domain(suppliedCauseCode.length > 0, "suppliedCauseCode");
    return {
      token: JSON.stringify([participantId, eventId, suppliedCauseCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { participantId: "P17", eventId: "E4", suppliedCauseCode: "cause A" },
  output: { token: '["P17","E4","cause A"]' },
} satisfies ToolExample<Input, Output>;
export const competingEventCauseTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/competing-event-cause-token",
    title: "Competing Event Cause Token",
    description:
      "Record an explicit competing-event cause code without inferring causal or clinical classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        eventId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCauseCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "eventId", "suppliedCauseCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventId",
          label: "Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCauseCode",
          label: "Supplied Cause Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = competingEventCauseTokenTool.execute;
export default competingEventCauseTokenTool;
