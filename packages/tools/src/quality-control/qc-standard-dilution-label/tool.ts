import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardId: string;
  readonly suppliedDilutionText: string;
  readonly preparationRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDilutionText: { type: "string", maxLength: 8192, minLength: 1 },
    preparationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["standardId", "suppliedDilutionText", "preparationRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit standard-dilution wording by preparation record without calculating or prescribing preparation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { standardId, suppliedDilutionText, preparationRecordId } = request;
  const compute = (): Output => {
    H.domain(standardId.length > 0, "standardId");
    H.domain(suppliedDilutionText.length > 0, "suppliedDilutionText");
    H.domain(preparationRecordId.length > 0, "preparationRecordId");
    return {
      token: JSON.stringify([
        standardId,
        suppliedDilutionText,
        preparationRecordId,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    standardId: "STD17",
    suppliedDilutionText: "1:10",
    preparationRecordId: "PREP2",
  },
  output: { token: '["STD17","1:10","PREP2"]' },
} satisfies ToolExample<Input, Output>;
export const qcStandardDilutionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-control",
        "quality control",
        "research and quality management",
      ],
      keywords: ["quality control", "research and quality management"],
    },
    id: "quality-control/qc-standard-dilution-label",
    title: "QC Standard Dilution Label",
    description:
      "Qualify explicit standard-dilution wording by preparation record without calculating or prescribing preparation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        standardId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDilutionText: { type: "string", maxLength: 8192, minLength: 1 },
        preparationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["standardId", "suppliedDilutionText", "preparationRecordId"],
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
          id: "standardId",
          label: "Standard Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDilutionText",
          label: "Supplied Dilution Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preparationRecordId",
          label: "Preparation Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qcStandardDilutionLabelTool.execute;
export default qcStandardDilutionLabelTool;
