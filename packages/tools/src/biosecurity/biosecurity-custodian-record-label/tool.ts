import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemRecordId: string;
  readonly custodianId: string;
  readonly assignmentRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    custodianId: { type: "string", maxLength: 8192, minLength: 1 },
    assignmentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["itemRecordId", "custodianId", "assignmentRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit custodian assignment record without exposing storage contents or granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemRecordId, custodianId, assignmentRecordId } = request;
  const compute = (): Output => {
    H.domain(itemRecordId.length > 0, "itemRecordId");
    H.domain(custodianId.length > 0, "custodianId");
    H.domain(assignmentRecordId.length > 0, "assignmentRecordId");
    return {
      token: JSON.stringify([itemRecordId, custodianId, assignmentRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemRecordId: "I17", custodianId: "C2", assignmentRecordId: "AS2" },
  output: { token: '["I17","C2","AS2"]' },
} satisfies ToolExample<Input, Output>;
export const biosecurityCustodianRecordLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosecurity", "research and quality management"],
      keywords: ["biosecurity", "research and quality management"],
    },
    id: "biosecurity/biosecurity-custodian-record-label",
    title: "Biosecurity Custodian Record Label",
    description:
      "Qualify an explicit custodian assignment record without exposing storage contents or granting access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        custodianId: { type: "string", maxLength: 8192, minLength: 1 },
        assignmentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["itemRecordId", "custodianId", "assignmentRecordId"],
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
          id: "itemRecordId",
          label: "Item Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "custodianId",
          label: "Custodian Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignmentRecordId",
          label: "Assignment Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biosecurityCustodianRecordLabelTool.execute;
export default biosecurityCustodianRecordLabelTool;
