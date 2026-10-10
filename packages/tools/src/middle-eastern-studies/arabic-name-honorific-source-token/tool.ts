import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedNameText: string;
  readonly suppliedHonorific: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedNameText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedHonorific: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedNameText", "suppliedHonorific", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly transcribed name and honorific with source without inferring identity, rank, or affiliation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedNameText, suppliedHonorific, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedNameText.length > 0, "suppliedNameText");
    H.domain(suppliedHonorific.length > 0, "suppliedHonorific");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([
        recordId,
        suppliedNameText,
        suppliedHonorific,
        source,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedNameText: "Name A",
    suppliedHonorific: "Honorific A",
    source: "Source A",
  },
  output: { token: '["R17","Name A","Honorific A","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const arabicNameHonorificSourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/arabic-name-honorific-source-token",
    title: "Arabic Name Honorific Source Token",
    description:
      "Preserve an explicitly transcribed name and honorific with source without inferring identity, rank, or affiliation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedNameText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedHonorific: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedNameText", "suppliedHonorific", "source"],
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
          id: "suppliedNameText",
          label: "Supplied Name Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedHonorific",
          label: "Supplied Honorific",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = arabicNameHonorificSourceTokenTool.execute;
export default arabicNameHonorificSourceTokenTool;
