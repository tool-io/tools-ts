import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly standardTransferRate: number;
  readonly alpha: number;
  readonly beta: number;
  readonly cleanSaturation: number;
  readonly processDissolved: number;
  readonly temperatureFactor: number;
};
export type Output = {
  readonly drivingForceFraction: number;
  readonly actualTransferRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    standardTransferRate: { type: "number", minimum: 0 },
    alpha: { type: "number", minimum: 0 },
    beta: { type: "number", minimum: 0 },
    cleanSaturation: { type: "number", exclusiveMinimum: 0 },
    processDissolved: { type: "number", minimum: 0 },
    temperatureFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "standardTransferRate",
    "alpha",
    "beta",
    "cleanSaturation",
    "processDissolved",
    "temperatureFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drivingForceFraction: { type: "number" },
    actualTransferRate: { type: "number" },
  },
  required: ["drivingForceFraction", "actualTransferRate"],
} as const;
/** Explicit alpha/beta oxygen-transfer correction with a supplied temperature factor and matching saturation reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    standardTransferRate,
    alpha,
    beta,
    cleanSaturation,
    processDissolved,
    temperatureFactor,
  } = request;
  const compute = (): Output => {
    H.domain(
      standardTransferRate >= 0 &&
        alpha >= 0 &&
        beta >= 0 &&
        processDissolved >= 0,
    );
    H.positive(cleanSaturation);
    H.positive(temperatureFactor);
    return {
      drivingForceFraction:
        (beta * cleanSaturation - processDissolved) / cleanSaturation,
      actualTransferRate:
        (standardTransferRate *
          alpha *
          temperatureFactor *
          (beta * cleanSaturation - processDissolved)) /
        cleanSaturation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    standardTransferRate: 100,
    alpha: 0.8,
    beta: 0.9,
    cleanSaturation: 10,
    processDissolved: 2,
    temperatureFactor: 1,
  },
  output: { drivingForceFraction: 0.7, actualTransferRate: 56 },
} satisfies ToolExample<Input, Output>;
export const aerationOxygenTransferSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/aeration-oxygen-transfer-supplied-factor",
      title: "Aeration Oxygen Transfer Supplied Factor Tool",
      description:
        "Explicit alpha/beta oxygen-transfer correction with a supplied temperature factor and matching saturation reference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          standardTransferRate: { type: "number", minimum: 0 },
          alpha: { type: "number", minimum: 0 },
          beta: { type: "number", minimum: 0 },
          cleanSaturation: { type: "number", exclusiveMinimum: 0 },
          processDissolved: { type: "number", minimum: 0 },
          temperatureFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "standardTransferRate",
          "alpha",
          "beta",
          "cleanSaturation",
          "processDissolved",
          "temperatureFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          drivingForceFraction: { type: "number" },
          actualTransferRate: { type: "number" },
        },
        required: ["drivingForceFraction", "actualTransferRate"],
      },
      ports: {
        inputs: [
          {
            id: "standardTransferRate",
            label: "Standard Transfer Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "alpha",
            label: "Alpha",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "beta",
            label: "Beta",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cleanSaturation",
            label: "Clean Saturation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "processDissolved",
            label: "Process Dissolved",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "temperatureFactor",
            label: "Temperature Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "drivingForceFraction",
            label: "Driving Force Fraction",
            valueType: { type: "number" },
          },
          {
            id: "actualTransferRate",
            label: "Actual Transfer Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aerationOxygenTransferSuppliedFactorTool.execute;
export default aerationOxygenTransferSuppliedFactorTool;
