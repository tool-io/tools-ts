import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly visitId: string;
  readonly suppliedCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    visitId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "visitId", "suppliedCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit study follow-up censoring metadata without assigning an event time or censoring mechanism. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, visitId, suppliedCode } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(visitId.length > 0, "visitId");
    H.domain(suppliedCode.length > 0, "suppliedCode");
    return { token: JSON.stringify([participantId, visitId, suppliedCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    visitId: "V4",
    suppliedCode: "lost follow-up",
  },
  output: { token: '["P17","V4","lost follow-up"]' },
} satisfies ToolExample<Input, Output>;
export const personVisitLossFollowUpCensoringCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["biostatistics", "research and quality management"],
        keywords: ["biostatistics", "research and quality management"],
      },
      id: "biostatistics/person-visit-loss-follow-up-censoring-code",
      title: "Person Visit Loss Follow Up Censoring Code",
      description:
        "Preserve explicit study follow-up censoring metadata without assigning an event time or censoring mechanism.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantId: { type: "string", maxLength: 8192, minLength: 1 },
          visitId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["participantId", "visitId", "suppliedCode"],
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
            id: "visitId",
            label: "Visit Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCode",
            label: "Supplied Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = personVisitLossFollowUpCensoringCodeTool.execute;
export default personVisitLossFollowUpCensoringCodeTool;
