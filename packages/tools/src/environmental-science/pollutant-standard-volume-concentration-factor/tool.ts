import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedConcentration: number;
  readonly measuredGasVolume: number;
  readonly suppliedStandardGasVolume: number;
};
export type Output = { readonly standardVolumeConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedConcentration: { type: "number", minimum: 0 },
    measuredGasVolume: { type: "number", minimum: 0 },
    suppliedStandardGasVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "reportedConcentration",
    "measuredGasVolume",
    "suppliedStandardGasVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardVolumeConcentration: { type: "number" } },
  required: ["standardVolumeConcentration"],
} as const;
/** Rebase an explicit pollutant mass-per-gas-volume concentration to a supplied standard gas volume while conserving pollutant mass. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reportedConcentration,
    measuredGasVolume,
    suppliedStandardGasVolume,
  } = request;
  const compute = (): Output => {
    H.domain(
      reportedConcentration >= 0 && measuredGasVolume >= 0,
      "reportedConcentration",
    );
    (H.domain(
      Number.isFinite(suppliedStandardGasVolume) &&
        suppliedStandardGasVolume > 0,
      "suppliedStandardGasVolume",
    ),
      suppliedStandardGasVolume);
    return {
      standardVolumeConcentration:
        (reportedConcentration * measuredGasVolume) / suppliedStandardGasVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportedConcentration: 10,
    measuredGasVolume: 120,
    suppliedStandardGasVolume: 100,
  },
  output: { standardVolumeConcentration: 12 },
} satisfies ToolExample<Input, Output>;
export const pollutantStandardVolumeConcentrationFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "environmental-science",
          "environmental science",
          "earth and environmental sciences",
        ],
        keywords: ["environmental science", "earth and environmental sciences"],
      },
      id: "environmental-science/pollutant-standard-volume-concentration-factor",
      title: "Pollutant Standard Volume Concentration Factor",
      description:
        "Rebase an explicit pollutant mass-per-gas-volume concentration to a supplied standard gas volume while conserving pollutant mass.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reportedConcentration: { type: "number", minimum: 0 },
          measuredGasVolume: { type: "number", minimum: 0 },
          suppliedStandardGasVolume: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "reportedConcentration",
          "measuredGasVolume",
          "suppliedStandardGasVolume",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { standardVolumeConcentration: { type: "number" } },
        required: ["standardVolumeConcentration"],
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
            id: "measuredGasVolume",
            label: "Measured Gas Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedStandardGasVolume",
            label: "Supplied Standard Gas Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "standardVolumeConcentration",
            label: "Standard Volume Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pollutantStandardVolumeConcentrationFactorTool.execute;
export default pollutantStandardVolumeConcentrationFactorTool;
