import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly datasetId: string;
  readonly originalCode: string;
  readonly suppliedSuccessorCode: string;
  readonly codebookVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datasetId: { type: "string", maxLength: 8192, minLength: 1 },
    originalCode: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSuccessorCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "datasetId",
    "originalCode",
    "suppliedSuccessorCode",
    "codebookVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit country-code successor assertion and codebook version without imposing historical geopolitical mappings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { datasetId, originalCode, suppliedSuccessorCode, codebookVersion } =
    request;
  const compute = (): Output => {
    H.domain(datasetId.length > 0, "datasetId");
    H.domain(originalCode.length > 0, "originalCode");
    H.domain(suppliedSuccessorCode.length > 0, "suppliedSuccessorCode");
    H.domain(codebookVersion.length > 0, "codebookVersion");
    return {
      token: JSON.stringify([
        datasetId,
        originalCode,
        suppliedSuccessorCode,
        codebookVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    datasetId: "D17",
    originalCode: "OLD",
    suppliedSuccessorCode: "NEW",
    codebookVersion: "v2",
  },
  output: { token: '["D17","OLD","NEW","v2"]' },
} satisfies ToolExample<Input, Output>;
export const globalDatasetCountryCodeSuccessorTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "global-studies/global-dataset-country-code-successor-tag",
      title: "Global Dataset Country Code Successor Tag Tool",
      description:
        "Preserve an explicit country-code successor assertion and codebook version without imposing historical geopolitical mappings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          datasetId: { type: "string", maxLength: 8192, minLength: 1 },
          originalCode: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedSuccessorCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "datasetId",
          "originalCode",
          "suppliedSuccessorCode",
          "codebookVersion",
        ],
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
            id: "originalCode",
            label: "Original Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedSuccessorCode",
            label: "Supplied Successor Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "codebookVersion",
            label: "Codebook Version",
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
export const run = globalDatasetCountryCodeSuccessorTagTool.execute;
export default globalDatasetCountryCodeSuccessorTagTool;
