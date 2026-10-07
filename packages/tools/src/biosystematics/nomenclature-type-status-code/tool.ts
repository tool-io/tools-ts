import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specimenId: string;
  readonly suppliedTypeCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specimenId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTypeCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["specimenId", "suppliedTypeCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit nomenclatural type-status code by source without assigning type status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { specimenId, suppliedTypeCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(specimenId.length > 0, "specimenId");
    H.domain(suppliedTypeCode.length > 0, "suppliedTypeCode");
    H.domain(codeSource.length > 0, "codeSource");
    return {
      token: JSON.stringify([specimenId, suppliedTypeCode, codeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specimenId: "SP17",
    suppliedTypeCode: "TYPE2",
    codeSource: "Catalogue A",
  },
  output: { token: '["SP17","TYPE2","Catalogue A"]' },
} satisfies ToolExample<Input, Output>;
export const nomenclatureTypeStatusCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/nomenclature-type-status-code",
    title: "Nomenclature Type Status Code",
    description:
      "Qualify an explicit nomenclatural type-status code by source without assigning type status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specimenId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTypeCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["specimenId", "suppliedTypeCode", "codeSource"],
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
          id: "specimenId",
          label: "Specimen Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTypeCode",
          label: "Supplied Type Code",
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
export const run = nomenclatureTypeStatusCodeTool.execute;
export default nomenclatureTypeStatusCodeTool;
