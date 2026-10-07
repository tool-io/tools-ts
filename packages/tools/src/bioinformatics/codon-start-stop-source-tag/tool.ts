import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly codonText: string;
  readonly suppliedRole: string;
  readonly geneticCodeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codonText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRole: { type: "string", maxLength: 8192, minLength: 1 },
    geneticCodeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["codonText", "suppliedRole", "geneticCodeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit codon role and genetic-code source without assigning start or stop status across code tables. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codonText, suppliedRole, geneticCodeSource } = request;
  const compute = (): Output => {
    H.domain(codonText.length > 0, "codonText");
    H.domain(suppliedRole.length > 0, "suppliedRole");
    H.domain(geneticCodeSource.length > 0, "geneticCodeSource");
    return {
      token: JSON.stringify([codonText, suppliedRole, geneticCodeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    codonText: "ATG",
    suppliedRole: "start",
    geneticCodeSource: "table supplied by caller",
  },
  output: { token: '["ATG","start","table supplied by caller"]' },
} satisfies ToolExample<Input, Output>;
export const codonStartStopSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/codon-start-stop-source-tag",
    title: "Codon Start Stop Source Tag",
    description:
      "Record an explicit codon role and genetic-code source without assigning start or stop status across code tables.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codonText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRole: { type: "string", maxLength: 8192, minLength: 1 },
        geneticCodeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["codonText", "suppliedRole", "geneticCodeSource"],
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
          id: "codonText",
          label: "Codon Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRole",
          label: "Supplied Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "geneticCodeSource",
          label: "Genetic Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = codonStartStopSourceTagTool.execute;
export default codonStartStopSourceTagTool;
