import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equipmentId: string;
  readonly handoffRecordId: string;
  readonly suppliedStatusCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
    handoffRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedStatusCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["equipmentId", "handoffRecordId", "suppliedStatusCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit cleaning-handoff metadata without specifying or validating cleaning procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equipmentId, handoffRecordId, suppliedStatusCode } = request;
  const compute = (): Output => {
    H.domain(equipmentId.length > 0, "equipmentId");
    H.domain(handoffRecordId.length > 0, "handoffRecordId");
    H.domain(suppliedStatusCode.length > 0, "suppliedStatusCode");
    return {
      token: JSON.stringify([equipmentId, handoffRecordId, suppliedStatusCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    equipmentId: "EQ17",
    handoffRecordId: "H2",
    suppliedStatusCode: "recorded",
  },
  output: { token: '["EQ17","H2","recorded"]' },
} satisfies ToolExample<Input, Output>;
export const biosafetyCleaningHandoffCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosafety", "research and quality management"],
      keywords: ["biosafety", "research and quality management"],
    },
    id: "biosafety/biosafety-cleaning-handoff-code",
    title: "Biosafety Cleaning Handoff Code",
    description:
      "Preserve explicit cleaning-handoff metadata without specifying or validating cleaning procedures.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equipmentId: { type: "string", maxLength: 8192, minLength: 1 },
        handoffRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedStatusCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["equipmentId", "handoffRecordId", "suppliedStatusCode"],
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
          id: "equipmentId",
          label: "Equipment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "handoffRecordId",
          label: "Handoff Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedStatusCode",
          label: "Supplied Status Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosafetyCleaningHandoffCodeTool.execute;
export default biosafetyCleaningHandoffCodeTool;
