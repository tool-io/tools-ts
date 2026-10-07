import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly withdrawalWording: string;
  readonly suppliedRetentionScope: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    withdrawalWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRetentionScope: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "withdrawalWording", "suppliedRetentionScope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit withdrawal and limited-retention status record without determining legal data-retention authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, withdrawalWording, suppliedRetentionScope } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(withdrawalWording.length > 0, "withdrawalWording");
    H.domain(suppliedRetentionScope.length > 0, "suppliedRetentionScope");
    return {
      token: JSON.stringify([
        participantId,
        withdrawalWording,
        suppliedRetentionScope,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    withdrawalWording: "withdrawal recorded",
    suppliedRetentionScope: "aggregate data",
  },
  output: { token: '["P17","withdrawal recorded","aggregate data"]' },
} satisfies ToolExample<Input, Output>;
export const withdrawalLimitedRetentionStatusTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bioethics", "research and quality management"],
        keywords: ["bioethics", "research and quality management"],
      },
      id: "bioethics/withdrawal-limited-retention-status-tag",
      title: "Withdrawal Limited Retention Status Tag",
      description:
        "Preserve an explicit withdrawal and limited-retention status record without determining legal data-retention authority.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantId: { type: "string", maxLength: 8192, minLength: 1 },
          withdrawalWording: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRetentionScope: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "participantId",
          "withdrawalWording",
          "suppliedRetentionScope",
        ],
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
            id: "withdrawalWording",
            label: "Withdrawal Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRetentionScope",
            label: "Supplied Retention Scope",
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
export const run = withdrawalLimitedRetentionStatusTagTool.execute;
export default withdrawalLimitedRetentionStatusTagTool;
