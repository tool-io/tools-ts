import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assetId: string;
  readonly custodianCode: string;
  readonly assignedDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assetId: { type: "string", maxLength: 8192, minLength: 1 },
    custodianCode: { type: "string", maxLength: 8192, minLength: 1 },
    assignedDate: { type: "string", maxLength: 8192 },
  },
  required: ["assetId", "custodianCode", "assignedDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly recorded corporate asset custody and assignment date without determining ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assetId, custodianCode, assignedDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(assetId.length > 0 && custodianCode.length > 0, "assetId");
    namedDate(assignedDate, "assignedDate");
    return {
      label:
        assetId + "; custodian=" + custodianCode + "; assigned=" + assignedDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assetId: "AS17",
    custodianCode: "TEAM-A",
    assignedDate: "2026-11-01",
  },
  output: { label: "AS17; custodian=TEAM-A; assigned=2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const corporateAssetCustodianLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/corporate-asset-custodian-label",
    title: "Corporate Asset Custodian Label",
    description:
      "Label explicitly recorded corporate asset custody and assignment date without determining ownership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assetId: { type: "string", maxLength: 8192, minLength: 1 },
        custodianCode: { type: "string", maxLength: 8192, minLength: 1 },
        assignedDate: { type: "string", maxLength: 8192 },
      },
      required: ["assetId", "custodianCode", "assignedDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "assetId",
          label: "Asset Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "custodianCode",
          label: "Custodian Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignedDate",
          label: "Assigned Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = corporateAssetCustodianLabelTool.execute;
export default corporateAssetCustodianLabelTool;
