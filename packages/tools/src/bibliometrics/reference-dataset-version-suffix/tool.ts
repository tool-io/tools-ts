import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly datasetId: string;
  readonly versionText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datasetId: { type: "string", maxLength: 8192, minLength: 1 },
    versionText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["datasetId", "versionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact supplied dataset reference and version as an ordered record without selecting the latest version. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { datasetId, versionText } = request;
  const compute = (): Output => {
    H.domain(datasetId.length > 0, "datasetId");
    H.domain(versionText.length > 0, "versionText");
    return { token: JSON.stringify([datasetId, versionText]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { datasetId: "D17", versionText: "v2.1" },
  output: { token: '["D17","v2.1"]' },
} satisfies ToolExample<Input, Output>;
export const referenceDatasetVersionSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/reference-dataset-version-suffix",
    title: "Reference Dataset Version Suffix",
    description:
      "Encode an exact supplied dataset reference and version as an ordered record without selecting the latest version.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datasetId: { type: "string", maxLength: 8192, minLength: 1 },
        versionText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["datasetId", "versionText"],
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
          id: "datasetId",
          label: "Dataset Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "versionText",
          label: "Version Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = referenceDatasetVersionSuffixTool.execute;
export default referenceDatasetVersionSuffixTool;
