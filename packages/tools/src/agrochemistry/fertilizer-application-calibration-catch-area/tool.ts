import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caughtMass: number;
  readonly coveredArea: number;
  readonly backgroundMass: number;
  readonly reportingArea: number;
};
export type Output = {
  readonly netMassPerArea: number;
  readonly reportingMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caughtMass: { type: "number" },
    coveredArea: { type: "number", exclusiveMinimum: 0 },
    backgroundMass: { type: "number" },
    reportingArea: { type: "number", minimum: 0 },
  },
  required: ["caughtMass", "coveredArea", "backgroundMass", "reportingArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMassPerArea: { type: "number" },
    reportingMass: { type: "number" },
  },
  required: ["netMassPerArea", "reportingMass"],
} as const;
/** Observed catch-mass calibration with an explicit background and area basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caughtMass, coveredArea, backgroundMass, reportingArea } = request;
  const compute = (): Output => {
    H.positive(coveredArea);
    H.domain(reportingArea >= 0);
    return {
      netMassPerArea: (caughtMass - backgroundMass) / coveredArea,
      reportingMass:
        ((caughtMass - backgroundMass) * reportingArea) / coveredArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caughtMass: 12,
    coveredArea: 10,
    backgroundMass: 2,
    reportingArea: 100,
  },
  output: { netMassPerArea: 1, reportingMass: 100 },
} satisfies ToolExample<Input, Output>;
export const fertilizerApplicationCalibrationCatchAreaTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/fertilizer-application-calibration-catch-area",
      title: "Fertilizer Application Calibration Catch Area Tool",
      description:
        "Observed catch-mass calibration with an explicit background and area basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          caughtMass: { type: "number" },
          coveredArea: { type: "number", exclusiveMinimum: 0 },
          backgroundMass: { type: "number" },
          reportingArea: { type: "number", minimum: 0 },
        },
        required: [
          "caughtMass",
          "coveredArea",
          "backgroundMass",
          "reportingArea",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netMassPerArea: { type: "number" },
          reportingMass: { type: "number" },
        },
        required: ["netMassPerArea", "reportingMass"],
      },
      ports: {
        inputs: [
          {
            id: "caughtMass",
            label: "Caught Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "coveredArea",
            label: "Covered Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backgroundMass",
            label: "Background Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reportingArea",
            label: "Reporting Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netMassPerArea",
            label: "Net Mass Per Area",
            valueType: { type: "number" },
          },
          {
            id: "reportingMass",
            label: "Reporting Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fertilizerApplicationCalibrationCatchAreaTool.execute;
export default fertilizerApplicationCalibrationCatchAreaTool;
