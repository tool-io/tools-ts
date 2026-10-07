import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly lipidBasisWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    lipidBasisWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "lipidBasisWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit biomonitoring lipid-basis label without estimating lipid normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, lipidBasisWording, source } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(lipidBasisWording.length > 0, "lipidBasisWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([resultId, lipidBasisWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    lipidBasisWording: "total lipid basis",
    source: "Lab A",
  },
  output: { token: '["R17","total lipid basis","Lab A"]' },
} satisfies ToolExample<Input, Output>;
export const biomonitoringLipidBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomonitoring", "biology"],
      keywords: ["biomonitoring", "biology"],
    },
    id: "biomonitoring/biomonitoring-lipid-basis-label",
    title: "Biomonitoring Lipid Basis Label",
    description:
      "Preserve an explicit biomonitoring lipid-basis label without estimating lipid normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        lipidBasisWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "lipidBasisWording", "source"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lipidBasisWording",
          label: "Lipid Basis Wording",
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
export const run = biomonitoringLipidBasisLabelTool.execute;
export default biomonitoringLipidBasisLabelTool;
