import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batch: string;
  readonly sampleParent: string;
  readonly specimen: string;
  readonly revision: string;
};
export type Output = { readonly matches: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batch: { type: "string", maxLength: 8192 },
    sampleParent: { type: "string", maxLength: 8192 },
    specimen: { type: "string", maxLength: 8192 },
    revision: { type: "string", maxLength: 8192 },
  },
  required: ["batch", "sampleParent", "specimen", "revision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "key"],
} as const;
/** Compare supplied benign batch/sample references. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batch, sampleParent, specimen, revision } = request;
  const compute = (): Output => {
    return {
      matches: batch === sampleParent,
      key: JSON.stringify([batch, specimen, revision]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batch: "B1", sampleParent: "B1", specimen: "S1", revision: "v2" },
  output: { matches: true, key: '["B1","S1","v2"]' },
} satisfies ToolExample<Input, Output>;
export const biofabricationBatchSampleParentPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-batch-sample-parent-pair",
      title: "Biofabrication Batch Sample Parent Pair Tool",
      description: "Compare supplied benign batch/sample references.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          batch: { type: "string", maxLength: 8192 },
          sampleParent: { type: "string", maxLength: 8192 },
          specimen: { type: "string", maxLength: 8192 },
          revision: { type: "string", maxLength: 8192 },
        },
        required: ["batch", "sampleParent", "specimen", "revision"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matches: { type: "boolean" },
          key: { type: "string", maxLength: 8192 },
        },
        required: ["matches", "key"],
      },
      ports: {
        inputs: [
          {
            id: "batch",
            label: "Batch",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sampleParent",
            label: "Sample Parent",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "specimen",
            label: "Specimen",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "revision",
            label: "Revision",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "matches", label: "Matches", valueType: { type: "boolean" } },
          { id: "key", label: "Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationBatchSampleParentPairTool.execute;
export default biofabricationBatchSampleParentPairTool;
