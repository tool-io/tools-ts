import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly supplementName: string;
  readonly informationSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    supplementName: { type: "string", maxLength: 8192, minLength: 1 },
    informationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "supplementName", "informationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a literal dietary supplement record and information source without recommending supplementation or inferring composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, supplementName, informationSource } = request;
  const compute = (): Output => {
    H.domain(
      recordId.length > 0 &&
        supplementName.length > 0 &&
        informationSource.length > 0,
      "recordId",
    );
    return {
      label:
        recordId +
        "; supplement=" +
        JSON.stringify(supplementName) +
        " [" +
        informationSource +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    supplementName: "Product A",
    informationSource: "package label",
  },
  output: { label: 'R17; supplement="Product A" [package label]' },
} satisfies ToolExample<Input, Output>;
export const dietaryRecordSupplementSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dietetics", "health and medicine"],
      keywords: ["dietetics", "health and medicine"],
    },
    id: "dietetics/dietary-record-supplement-source-label",
    title: "Dietary Record Supplement Source Label",
    description:
      "Label a literal dietary supplement record and information source without recommending supplementation or inferring composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        supplementName: { type: "string", maxLength: 8192, minLength: 1 },
        informationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "supplementName", "informationSource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "supplementName",
          label: "Supplement Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "informationSource",
          label: "Information Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dietaryRecordSupplementSourceLabelTool.execute;
export default dietaryRecordSupplementSourceLabelTool;
