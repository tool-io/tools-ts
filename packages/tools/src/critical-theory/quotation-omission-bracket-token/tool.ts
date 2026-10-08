import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly suppliedOmissionText: string };
export type Output = { readonly bracketedOmission: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { suppliedOmissionText: { type: "string", maxLength: 8192 } },
  required: ["suppliedOmissionText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bracketedOmission: { type: "string", maxLength: 8192 } },
  required: ["bracketedOmission"],
} as const;
/** Wrap an explicitly supplied quotation omission marker in square brackets without editing source text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedOmissionText } = request;
  const compute = (): Output => {
    return { bracketedOmission: "[" + suppliedOmissionText + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedOmissionText: "…" },
  output: { bracketedOmission: "[…]" },
} satisfies ToolExample<Input, Output>;
export const quotationOmissionBracketTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/quotation-omission-bracket-token",
    title: "Quotation Omission Bracket Token",
    description:
      "Wrap an explicitly supplied quotation omission marker in square brackets without editing source text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { suppliedOmissionText: { type: "string", maxLength: 8192 } },
      required: ["suppliedOmissionText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { bracketedOmission: { type: "string", maxLength: 8192 } },
      required: ["bracketedOmission"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedOmissionText",
          label: "Supplied Omission Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "bracketedOmission",
          label: "Bracketed Omission",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = quotationOmissionBracketTokenTool.execute;
export default quotationOmissionBracketTokenTool;
