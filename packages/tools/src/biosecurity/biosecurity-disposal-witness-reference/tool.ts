import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispositionRecordId: string;
  readonly witnessId: string;
  readonly witnessRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispositionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    witnessId: { type: "string", maxLength: 8192, minLength: 1 },
    witnessRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["dispositionRecordId", "witnessId", "witnessRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit disposition witness reference without specifying disposal procedures. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispositionRecordId, witnessId, witnessRecordId } = request;
  const compute = (): Output => {
    H.domain(dispositionRecordId.length > 0, "dispositionRecordId");
    H.domain(witnessId.length > 0, "witnessId");
    H.domain(witnessRecordId.length > 0, "witnessRecordId");
    return {
      token: JSON.stringify([dispositionRecordId, witnessId, witnessRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dispositionRecordId: "DIS17",
    witnessId: "W2",
    witnessRecordId: "WR2",
  },
  output: { token: '["DIS17","W2","WR2"]' },
} satisfies ToolExample<Input, Output>;
export const biosecurityDisposalWitnessReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["biosecurity", "research and quality management"],
        keywords: ["biosecurity", "research and quality management"],
      },
      id: "biosecurity/biosecurity-disposal-witness-reference",
      title: "Biosecurity Disposal Witness Reference",
      description:
        "Qualify an explicit disposition witness reference without specifying disposal procedures.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dispositionRecordId: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          witnessId: { type: "string", maxLength: 8192, minLength: 1 },
          witnessRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["dispositionRecordId", "witnessId", "witnessRecordId"],
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
            id: "dispositionRecordId",
            label: "Disposition Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "witnessId",
            label: "Witness Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "witnessRecordId",
            label: "Witness Record Id",
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
export const run = biosecurityDisposalWitnessReferenceTool.execute;
export default biosecurityDisposalWitnessReferenceTool;
