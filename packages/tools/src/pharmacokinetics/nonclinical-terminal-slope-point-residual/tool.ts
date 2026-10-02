import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly concentration: number;
  readonly suppliedLogIntercept: number;
  readonly suppliedSlope: number;
};
export type Output = {
  readonly predictedConcentration: number;
  readonly logResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    concentration: { type: "number", exclusiveMinimum: 0 },
    suppliedLogIntercept: { type: "number" },
    suppliedSlope: { type: "number" },
  },
  required: ["time", "concentration", "suppliedLogIntercept", "suppliedSlope"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedConcentration: { type: "number" },
    logResidual: { type: "number" },
  },
  required: ["predictedConcentration", "logResidual"],
} as const;
/** Compare one nonclinical point to a supplied log-linear curve without fitting a terminal phase or recommending doses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, concentration, suppliedLogIntercept, suppliedSlope } = request;
  const compute = (): Output => {
    H.positive(concentration);
    return {
      predictedConcentration: Math.exp(
        suppliedLogIntercept + suppliedSlope * time,
      ),
      logResidual:
        Math.log(concentration) - suppliedLogIntercept - suppliedSlope * time,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 1,
    concentration: 0.5,
    suppliedLogIntercept: 0,
    suppliedSlope: -1,
  },
  output: {
    predictedConcentration: 0.36787944117144233,
    logResidual: 0.3068528194400547,
  },
} satisfies ToolExample<Input, Output>;
export const nonclinicalTerminalSlopePointResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/nonclinical-terminal-slope-point-residual",
      title: "Nonclinical Terminal Slope Point Residual Tool",
      description:
        "Compare one nonclinical point to a supplied log-linear curve without fitting a terminal phase or recommending doses.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          time: { type: "number" },
          concentration: { type: "number", exclusiveMinimum: 0 },
          suppliedLogIntercept: { type: "number" },
          suppliedSlope: { type: "number" },
        },
        required: [
          "time",
          "concentration",
          "suppliedLogIntercept",
          "suppliedSlope",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictedConcentration: { type: "number" },
          logResidual: { type: "number" },
        },
        required: ["predictedConcentration", "logResidual"],
      },
      ports: {
        inputs: [
          {
            id: "time",
            label: "Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedLogIntercept",
            label: "Supplied Log Intercept",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedSlope",
            label: "Supplied Slope",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "predictedConcentration",
            label: "Predicted Concentration",
            valueType: { type: "number" },
          },
          {
            id: "logResidual",
            label: "Log Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nonclinicalTerminalSlopePointResidualTool.execute;
export default nonclinicalTerminalSlopePointResidualTool;
