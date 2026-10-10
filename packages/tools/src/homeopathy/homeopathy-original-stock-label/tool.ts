import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batchId: string;
  readonly stockLabel: string;
  readonly labelSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchId: { type: "string", maxLength: 8192, minLength: 1 },
    stockLabel: { type: "string", maxLength: 8192, minLength: 1 },
    labelSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["batchId", "stockLabel", "labelSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit original-stock label with its source without inferring composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchId, stockLabel, labelSource } = request;
  const compute = (): Output => {
    H.domain(batchId.length > 0, "batchId");
    H.domain(stockLabel.length > 0, "stockLabel");
    H.domain(labelSource.length > 0, "labelSource");
    return { token: JSON.stringify([batchId, stockLabel, labelSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batchId: "B17", stockLabel: "Stock A", labelSource: "Label scan" },
  output: { token: '["B17","Stock A","Label scan"]' },
} satisfies ToolExample<Input, Output>;
export const homeopathyOriginalStockLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["homeopathy", "health and medicine"],
      keywords: ["homeopathy", "health and medicine"],
    },
    id: "homeopathy/homeopathy-original-stock-label",
    title: "Homeopathy Original Stock Label",
    description:
      "Record an explicit original-stock label with its source without inferring composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        batchId: { type: "string", maxLength: 8192, minLength: 1 },
        stockLabel: { type: "string", maxLength: 8192, minLength: 1 },
        labelSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["batchId", "stockLabel", "labelSource"],
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
          id: "batchId",
          label: "Batch Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "stockLabel",
          label: "Stock Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "labelSource",
          label: "Label Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = homeopathyOriginalStockLabelTool.execute;
export default homeopathyOriginalStockLabelTool;
