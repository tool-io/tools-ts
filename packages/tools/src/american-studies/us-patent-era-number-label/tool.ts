import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedPatentNumber: string;
  readonly eraSourceLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPatentNumber: { type: "string", maxLength: 8192, minLength: 1 },
    eraSourceLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedPatentNumber", "eraSourceLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit historical patent-number transcription by era source without identifying a patent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedPatentNumber, eraSourceLabel } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedPatentNumber.length > 0, "suppliedPatentNumber");
    H.domain(eraSourceLabel.length > 0, "eraSourceLabel");
    return {
      token: JSON.stringify([recordId, suppliedPatentNumber, eraSourceLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedPatentNumber: "X-42",
    eraSourceLabel: "Catalogue A",
  },
  output: { token: '["R17","X-42","Catalogue A"]' },
} satisfies ToolExample<Input, Output>;
export const usPatentEraNumberLabelTool = H.defineSchemaCalculation<
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
    id: "american-studies/us-patent-era-number-label",
    title: "US Patent Era Number Label",
    description:
      "Qualify an explicit historical patent-number transcription by era source without identifying a patent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPatentNumber: { type: "string", maxLength: 8192, minLength: 1 },
        eraSourceLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedPatentNumber", "eraSourceLabel"],
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
          id: "suppliedPatentNumber",
          label: "Supplied Patent Number",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eraSourceLabel",
          label: "Era Source Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = usPatentEraNumberLabelTool.execute;
export default usPatentEraNumberLabelTool;
