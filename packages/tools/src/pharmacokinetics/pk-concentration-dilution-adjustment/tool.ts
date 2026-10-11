import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedConcentration: number;
  readonly explicitDilutionFactor: number;
};
export type Output = { readonly adjustedConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedConcentration: { type: "number", minimum: 0 },
    explicitDilutionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["reportedConcentration", "explicitDilutionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedConcentration: { type: "number" } },
  required: ["adjustedConcentration"],
} as const;
/** Apply an explicit concentration dilution correction factor without inferring assay recovery or patient exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedConcentration, explicitDilutionFactor } = request;
  const compute = (): Output => {
    H.domain(reportedConcentration >= 0, "reportedConcentration");
    (H.domain(explicitDilutionFactor > 0, "explicitDilutionFactor"),
      explicitDilutionFactor);
    return {
      adjustedConcentration: reportedConcentration * explicitDilutionFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedConcentration: 2.5, explicitDilutionFactor: 4 },
  output: { adjustedConcentration: 10 },
} satisfies ToolExample<Input, Output>;
export const pkConcentrationDilutionAdjustmentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacokinetics", "pharmacy"],
      keywords: ["pharmacokinetics", "pharmacy"],
    },
    id: "pharmacokinetics/pk-concentration-dilution-adjustment",
    title: "PK Concentration Dilution Adjustment",
    description:
      "Apply an explicit concentration dilution correction factor without inferring assay recovery or patient exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedConcentration: { type: "number", minimum: 0 },
        explicitDilutionFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["reportedConcentration", "explicitDilutionFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { adjustedConcentration: { type: "number" } },
      required: ["adjustedConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "reportedConcentration",
          label: "Reported Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "explicitDilutionFactor",
          label: "Explicit Dilution Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedConcentration",
          label: "Adjusted Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkConcentrationDilutionAdjustmentTool.execute;
export default pkConcentrationDilutionAdjustmentTool;
