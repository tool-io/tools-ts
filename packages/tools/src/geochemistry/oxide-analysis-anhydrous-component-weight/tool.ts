import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedComponentWeight: number;
  readonly reportedWaterWeight: number;
  readonly totalReportedWeight: number;
};
export type Output = {
  readonly anhydrousPercent: number;
  readonly dryReportedTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedComponentWeight: { type: "number", minimum: 0 },
    reportedWaterWeight: { type: "number", minimum: 0 },
    totalReportedWeight: { type: "number" },
  },
  required: [
    "reportedComponentWeight",
    "reportedWaterWeight",
    "totalReportedWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anhydrousPercent: { type: "number" },
    dryReportedTotal: { type: "number" },
  },
  required: ["anhydrousPercent", "dryReportedTotal"],
} as const;
/** Renormalize one explicitly supplied oxide component to a water-excluded total without inferring mineralogy or missing components. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedComponentWeight, reportedWaterWeight, totalReportedWeight } =
    request;
  const compute = (): Output => {
    H.domain(reportedWaterWeight >= 0, "reportedWaterWeight");
    H.domain(totalReportedWeight > reportedWaterWeight, "totalReportedWeight");
    H.domain(
      reportedComponentWeight >= 0 &&
        reportedComponentWeight <= totalReportedWeight - reportedWaterWeight,
      "reportedComponentWeight",
    );
    return {
      anhydrousPercent:
        (100 * reportedComponentWeight) /
        (totalReportedWeight - reportedWaterWeight),
      dryReportedTotal: totalReportedWeight - reportedWaterWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedComponentWeight: 20,
    reportedWaterWeight: 10,
    totalReportedWeight: 100,
  },
  output: { anhydrousPercent: 22.22222222222222, dryReportedTotal: 90 },
} satisfies ToolExample<Input, Output>;
export const oxideAnalysisAnhydrousComponentWeightTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/oxide-analysis-anhydrous-component-weight",
      title: "Oxide Analysis Anhydrous Component Weight Tool",
      description:
        "Renormalize one explicitly supplied oxide component to a water-excluded total without inferring mineralogy or missing components.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedComponentWeight: { type: "number", minimum: 0 },
          reportedWaterWeight: { type: "number", minimum: 0 },
          totalReportedWeight: { type: "number" },
        },
        required: [
          "reportedComponentWeight",
          "reportedWaterWeight",
          "totalReportedWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          anhydrousPercent: { type: "number" },
          dryReportedTotal: { type: "number" },
        },
        required: ["anhydrousPercent", "dryReportedTotal"],
      },
      ports: {
        inputs: [
          {
            id: "reportedComponentWeight",
            label: "Reported Component Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportedWaterWeight",
            label: "Reported Water Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalReportedWeight",
            label: "Total Reported Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "anhydrousPercent",
            label: "Anhydrous Percent",
            valueType: { type: "number" },
          },
          {
            id: "dryReportedTotal",
            label: "Dry Reported Total",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oxideAnalysisAnhydrousComponentWeightTool.execute;
export default oxideAnalysisAnhydrousComponentWeightTool;
