import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnId: string;
  readonly dispositionCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnId: { type: "string", maxLength: 8192, minLength: 1 },
    dispositionCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["returnId", "dispositionCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit medicine-return disposition code and source without deciding reuse or disposal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnId, dispositionCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(returnId.length > 0, "returnId");
    H.domain(dispositionCode.length > 0, "dispositionCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([returnId, dispositionCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    returnId: "RET17",
    dispositionCode: "D2",
    codeSource: "Service key A",
  },
  output: { token: '["RET17","D2","Service key A"]' },
} satisfies ToolExample<Input, Output>;
export const medicineReturnDispositionCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospital-pharmacy", "hospital pharmacy", "pharmacy"],
      keywords: ["hospital pharmacy", "pharmacy"],
    },
    id: "hospital-pharmacy/medicine-return-disposition-code",
    title: "Medicine Return Disposition Code",
    description:
      "Preserve an explicit medicine-return disposition code and source without deciding reuse or disposal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnId: { type: "string", maxLength: 8192, minLength: 1 },
        dispositionCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["returnId", "dispositionCode", "codeSource"],
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
          id: "returnId",
          label: "Return Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dispositionCode",
          label: "Disposition Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = medicineReturnDispositionCodeTool.execute;
export default medicineReturnDispositionCodeTool;
