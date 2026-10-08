import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly commodityText: string;
  readonly suppliedGrade: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    commodityText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedGrade: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "commodityText", "suppliedGrade"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit historical commodity grade transcription without mapping standards across places or periods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, commodityText, suppliedGrade } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(commodityText.length > 0, "commodityText");
    H.domain(suppliedGrade.length > 0, "suppliedGrade");
    return { token: JSON.stringify([recordId, commodityText, suppliedGrade]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", commodityText: "wheat", suppliedGrade: "Grade A" },
  output: { token: '["R17","wheat","Grade A"]' },
} satisfies ToolExample<Input, Output>;
export const historicalCommodityQualityGradeTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historical-commodity-quality-grade-token",
      title: "Historical Commodity Quality Grade Token Tool",
      description:
        "Record an explicit historical commodity grade transcription without mapping standards across places or periods.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          commodityText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedGrade: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "commodityText", "suppliedGrade"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "commodityText",
            label: "Commodity Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedGrade",
            label: "Supplied Grade",
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
export const run = historicalCommodityQualityGradeTokenTool.execute;
export default historicalCommodityQualityGradeTokenTool;
