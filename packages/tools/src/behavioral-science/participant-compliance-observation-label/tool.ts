import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly suppliedCode: string;
  readonly protocolSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCode: { type: "string", maxLength: 8192, minLength: 1 },
    protocolSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "suppliedCode", "protocolSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied participation observation code with its protocol source without inferring intent or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, suppliedCode, protocolSource } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(suppliedCode.length > 0, "suppliedCode");
    H.domain(protocolSource.length > 0, "protocolSource");
    return {
      token: JSON.stringify([observationId, suppliedCode, protocolSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    suppliedCode: "completed",
    protocolSource: "P4",
  },
  output: { token: '["O17","completed","P4"]' },
} satisfies ToolExample<Input, Output>;
export const participantComplianceObservationLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["behavioral-science", "behavioral science", "psychology"],
        keywords: ["behavioral science", "psychology"],
      },
      id: "behavioral-science/participant-compliance-observation-label",
      title: "Participant Compliance Observation Label",
      description:
        "Record a supplied participation observation code with its protocol source without inferring intent or compliance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCode: { type: "string", maxLength: 8192, minLength: 1 },
          protocolSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["observationId", "suppliedCode", "protocolSource"],
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
            id: "observationId",
            label: "Observation Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCode",
            label: "Supplied Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "protocolSource",
            label: "Protocol Source",
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
export const run = participantComplianceObservationLabelTool.execute;
export default participantComplianceObservationLabelTool;
