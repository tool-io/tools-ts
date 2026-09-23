import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyte: number;
  readonly lipidConcentration: number;
  readonly lipidUnitFactor: number;
  readonly reportingFactor: number;
};
export type Output = {
  readonly coherentLipid: number;
  readonly normalized: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyte: { type: "number", minimum: 0 },
    lipidConcentration: { type: "number", exclusiveMinimum: 0 },
    lipidUnitFactor: { type: "number", exclusiveMinimum: 0 },
    reportingFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "analyte",
    "lipidConcentration",
    "lipidUnitFactor",
    "reportingFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coherentLipid: { type: "number" },
    normalized: { type: "number" },
  },
  required: ["coherentLipid", "normalized"],
} as const;
/** Normalize supplied concentrations to an explicit lipid basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analyte, lipidConcentration, lipidUnitFactor, reportingFactor } =
    request;
  const compute = (): Output => {
    H.domain(analyte >= 0);
    H.positive(lipidConcentration);
    H.positive(lipidUnitFactor);
    H.positive(reportingFactor);
    return {
      coherentLipid: lipidConcentration * lipidUnitFactor,
      normalized:
        (analyte * reportingFactor) / (lipidConcentration * lipidUnitFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    analyte: 10,
    lipidConcentration: 2,
    lipidUnitFactor: 0.01,
    reportingFactor: 1,
  },
  output: { coherentLipid: 0.02, normalized: 500 },
} satisfies ToolExample<Input, Output>;
export const biomonitoringLipidNormalizedConcentrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biomonitoring/biomonitoring-lipid-normalized-concentration-term",
      title: "Biomonitoring Lipid Normalized Concentration Term Tool",
      description:
        "Normalize supplied concentrations to an explicit lipid basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          analyte: { type: "number", minimum: 0 },
          lipidConcentration: { type: "number", exclusiveMinimum: 0 },
          lipidUnitFactor: { type: "number", exclusiveMinimum: 0 },
          reportingFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "analyte",
          "lipidConcentration",
          "lipidUnitFactor",
          "reportingFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coherentLipid: { type: "number" },
          normalized: { type: "number" },
        },
        required: ["coherentLipid", "normalized"],
      },
      ports: {
        inputs: [
          {
            id: "analyte",
            label: "Analyte",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lipidConcentration",
            label: "Lipid Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lipidUnitFactor",
            label: "Lipid Unit Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportingFactor",
            label: "Reporting Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "coherentLipid",
            label: "Coherent Lipid",
            valueType: { type: "number" },
          },
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biomonitoringLipidNormalizedConcentrationTermTool.execute;
export default biomonitoringLipidNormalizedConcentrationTermTool;
