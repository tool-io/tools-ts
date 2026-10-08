import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyteName: string;
  readonly assayMethod: string;
  readonly laboratoryCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyteName: { type: "string", maxLength: 8192, minLength: 1 },
    assayMethod: { type: "string", maxLength: 8192, minLength: 1 },
    laboratoryCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["analyteName", "assayMethod", "laboratoryCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode explicitly recorded analyte, assay-method and laboratory metadata without asserting assay interchangeability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analyteName, assayMethod, laboratoryCode } = request;
  const compute = (): Output => {
    H.domain(
      analyteName.length > 0 &&
        assayMethod.length > 0 &&
        laboratoryCode.length > 0,
      "analyteName",
    );
    return {
      token: JSON.stringify([analyteName, assayMethod, laboratoryCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    analyteName: "analyte A",
    assayMethod: "recorded method",
    laboratoryCode: "LAB17",
  },
  output: { token: '["analyte A","recorded method","LAB17"]' },
} satisfies ToolExample<Input, Output>;
export const hormoneAssayMethodNameTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/hormone-assay-method-name-token",
    title: "Hormone Assay Method Name Token",
    description:
      "Encode explicitly recorded analyte, assay-method and laboratory metadata without asserting assay interchangeability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyteName: { type: "string", maxLength: 8192, minLength: 1 },
        assayMethod: { type: "string", maxLength: 8192, minLength: 1 },
        laboratoryCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["analyteName", "assayMethod", "laboratoryCode"],
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
          id: "analyteName",
          label: "Analyte Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assayMethod",
          label: "Assay Method",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "laboratoryCode",
          label: "Laboratory Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hormoneAssayMethodNameTokenTool.execute;
export default hormoneAssayMethodNameTokenTool;
