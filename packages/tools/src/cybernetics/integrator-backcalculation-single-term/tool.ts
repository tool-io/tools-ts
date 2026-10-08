import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly saturatedCommand: number;
  readonly rawCommand: number;
  readonly backCalculationGain: number;
  readonly timeStep: number;
};
export type Output = { readonly integratorCorrection: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saturatedCommand: { type: "number" },
    rawCommand: { type: "number" },
    backCalculationGain: { type: "number", minimum: 0 },
    timeStep: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "saturatedCommand",
    "rawCommand",
    "backCalculationGain",
    "timeStep",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integratorCorrection: { type: "number" } },
  required: ["integratorCorrection"],
} as const;
/** Calculate one explicit anti-windup back-calculation correction Kb times saturated-minus-raw command times step duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { saturatedCommand, rawCommand, backCalculationGain, timeStep } =
    request;
  const compute = (): Output => {
    H.domain(backCalculationGain >= 0, "backCalculationGain");
    (H.domain(Number.isFinite(timeStep) && timeStep > 0, "timeStep"), timeStep);
    return {
      integratorCorrection:
        backCalculationGain * (saturatedCommand - rawCommand) * timeStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    saturatedCommand: 8,
    rawCommand: 10,
    backCalculationGain: 2,
    timeStep: 0.5,
  },
  output: { integratorCorrection: -2 },
} satisfies ToolExample<Input, Output>;
export const integratorBackcalculationSingleTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cybernetics/integrator-backcalculation-single-term",
      title: "Integrator Backcalculation Single Term Tool",
      description:
        "Calculate one explicit anti-windup back-calculation correction Kb times saturated-minus-raw command times step duration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          saturatedCommand: { type: "number" },
          rawCommand: { type: "number" },
          backCalculationGain: { type: "number", minimum: 0 },
          timeStep: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "saturatedCommand",
          "rawCommand",
          "backCalculationGain",
          "timeStep",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { integratorCorrection: { type: "number" } },
        required: ["integratorCorrection"],
      },
      ports: {
        inputs: [
          {
            id: "saturatedCommand",
            label: "Saturated Command",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rawCommand",
            label: "Raw Command",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backCalculationGain",
            label: "Back Calculation Gain",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "timeStep",
            label: "Time Step",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "integratorCorrection",
            label: "Integrator Correction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = integratorBackcalculationSingleTermTool.execute;
export default integratorBackcalculationSingleTermTool;
