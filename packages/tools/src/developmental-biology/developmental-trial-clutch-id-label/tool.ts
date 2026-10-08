import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialCode: string;
  readonly clutchCode: string;
  readonly specimenCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialCode: { type: "string", maxLength: 8192, minLength: 1 },
    clutchCode: { type: "string", maxLength: 8192, minLength: 1 },
    specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trialCode", "clutchCode", "specimenCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Encode explicit trial, clutch and specimen grouping identifiers without inferring biological relatedness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialCode, clutchCode, specimenCode } = request;
  const compute = (): Output => {
    H.domain(
      trialCode.length > 0 && clutchCode.length > 0 && specimenCode.length > 0,
      "trialCode",
    );
    return { label: JSON.stringify([trialCode, clutchCode, specimenCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialCode: "T17", clutchCode: "C3", specimenCode: "S2" },
  output: { label: '["T17","C3","S2"]' },
} satisfies ToolExample<Input, Output>;
export const developmentalTrialClutchIdLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["developmental-biology", "developmental biology", "biology"],
      keywords: ["developmental biology", "biology"],
    },
    id: "developmental-biology/developmental-trial-clutch-id-label",
    title: "Developmental Trial Clutch ID Label",
    description:
      "Encode explicit trial, clutch and specimen grouping identifiers without inferring biological relatedness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialCode: { type: "string", maxLength: 8192, minLength: 1 },
        clutchCode: { type: "string", maxLength: 8192, minLength: 1 },
        specimenCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["trialCode", "clutchCode", "specimenCode"],
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
          id: "trialCode",
          label: "Trial Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "clutchCode",
          label: "Clutch Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "specimenCode",
          label: "Specimen Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = developmentalTrialClutchIdLabelTool.execute;
export default developmentalTrialClutchIdLabelTool;
