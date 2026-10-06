import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly containerId: string;
  readonly suppliedProductLabel: string;
  readonly batchCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    containerId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedProductLabel: { type: "string", maxLength: 8192, minLength: 1 },
    batchCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["containerId", "suppliedProductLabel", "batchCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate supplied conservation adhesive label and batch code without inferring composition or suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { containerId, suppliedProductLabel, batchCode } = request;
  const compute = (): Output => {
    H.domain(containerId.length > 0, "containerId");
    H.domain(suppliedProductLabel.length > 0, "suppliedProductLabel");
    H.domain(batchCode.length > 0, "batchCode");
    return {
      token: JSON.stringify([containerId, suppliedProductLabel, batchCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    containerId: "C17",
    suppliedProductLabel: "Adhesive A",
    batchCode: "B2401",
  },
  output: { token: '["C17","Adhesive A","B2401"]' },
} satisfies ToolExample<Input, Output>;
export const conservationAdhesiveLabelBatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/conservation-adhesive-label-batch",
    title: "Conservation Adhesive Label Batch",
    description:
      "Associate supplied conservation adhesive label and batch code without inferring composition or suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        containerId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedProductLabel: { type: "string", maxLength: 8192, minLength: 1 },
        batchCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["containerId", "suppliedProductLabel", "batchCode"],
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
          id: "containerId",
          label: "Container Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedProductLabel",
          label: "Supplied Product Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "batchCode",
          label: "Batch Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = conservationAdhesiveLabelBatchTool.execute;
export default conservationAdhesiveLabelBatchTool;
