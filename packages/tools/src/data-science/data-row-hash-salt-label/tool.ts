import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly datasetCode: string;
  readonly hashAlgorithm: string;
  readonly saltReference: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datasetCode: { type: "string", maxLength: 8192, minLength: 1 },
    hashAlgorithm: { type: "string", maxLength: 8192, minLength: 1 },
    saltReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["datasetCode", "hashAlgorithm", "saltReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label hashing provenance with a nonsecret salt-reference identifier without accepting a salt secret, computing hashes or guaranteeing anonymization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { datasetCode, hashAlgorithm, saltReference } = request;
  const compute = (): Output => {
    H.domain(
      datasetCode.length > 0 &&
        hashAlgorithm.length > 0 &&
        saltReference.length > 0,
      "datasetCode",
    );
    return {
      label:
        datasetCode +
        "; hash=" +
        hashAlgorithm +
        "; salt reference=" +
        saltReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    datasetCode: "DS17",
    hashAlgorithm: "SHA-256",
    saltReference: "key-ref-A",
  },
  output: { label: "DS17; hash=SHA-256; salt reference=key-ref-A" },
} satisfies ToolExample<Input, Output>;
export const dataRowHashSaltLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/data-row-hash-salt-label",
    title: "Data Row Hash Salt Label",
    description:
      "Label hashing provenance with a nonsecret salt-reference identifier without accepting a salt secret, computing hashes or guaranteeing anonymization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datasetCode: { type: "string", maxLength: 8192, minLength: 1 },
        hashAlgorithm: { type: "string", maxLength: 8192, minLength: 1 },
        saltReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["datasetCode", "hashAlgorithm", "saltReference"],
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
          id: "datasetCode",
          label: "Dataset Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "hashAlgorithm",
          label: "Hash Algorithm",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "saltReference",
          label: "Salt Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dataRowHashSaltLabelTool.execute;
export default dataRowHashSaltLabelTool;
