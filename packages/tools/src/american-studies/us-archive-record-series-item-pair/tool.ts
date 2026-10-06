import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveId: string;
  readonly seriesCode: string;
  readonly itemCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveId: { type: "string", maxLength: 8192, minLength: 1 },
    seriesCode: { type: "string", maxLength: 8192, minLength: 1 },
    itemCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveId", "seriesCode", "itemCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an unambiguous explicit archive series-item key without accessing records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveId, seriesCode, itemCode } = request;
  const compute = (): Output => {
    H.domain(archiveId.length > 0, "archiveId");
    H.domain(seriesCode.length > 0, "seriesCode");
    H.domain(itemCode.length > 0, "itemCode");
    return { token: JSON.stringify([archiveId, seriesCode, itemCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { archiveId: "AR17", seriesCode: "SER2", itemCode: "ITEM3" },
  output: { token: '["AR17","SER2","ITEM3"]' },
} satisfies ToolExample<Input, Output>;
export const usArchiveRecordSeriesItemPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["american-studies", "american studies", "humanities"],
      keywords: ["american studies", "humanities"],
    },
    id: "american-studies/us-archive-record-series-item-pair",
    title: "US Archive Record Series Item Pair",
    description:
      "Build an unambiguous explicit archive series-item key without accessing records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        archiveId: { type: "string", maxLength: 8192, minLength: 1 },
        seriesCode: { type: "string", maxLength: 8192, minLength: 1 },
        itemCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["archiveId", "seriesCode", "itemCode"],
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
          id: "archiveId",
          label: "Archive Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seriesCode",
          label: "Series Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemCode",
          label: "Item Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = usArchiveRecordSeriesItemPairTool.execute;
export default usArchiveRecordSeriesItemPairTool;
