import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positiveCurrentVoltage: number;
  readonly reversedCurrentVoltage: number;
};
export type Output = {
  readonly oddSignal: number;
  readonly evenOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveCurrentVoltage: { type: "number" },
    reversedCurrentVoltage: { type: "number" },
  },
  required: ["positiveCurrentVoltage", "reversedCurrentVoltage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oddSignal: { type: "number" }, evenOffset: { type: "number" } },
  required: ["oddSignal", "evenOffset"],
} as const;
/** Separate a supplied equal-magnitude opposite-current voltage pair into odd signal and even additive offset without estimating resistivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positiveCurrentVoltage, reversedCurrentVoltage } = request;
  const compute = (): Output => {
    return {
      oddSignal: positiveCurrentVoltage / 2 - reversedCurrentVoltage / 2,
      evenOffset: positiveCurrentVoltage / 2 + reversedCurrentVoltage / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positiveCurrentVoltage: 12, reversedCurrentVoltage: -8 },
  output: { oddSignal: 10, evenOffset: 2 },
} satisfies ToolExample<Input, Output>;
export const electricalSurveyCurrentReversalStackPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geophysics/electrical-survey-current-reversal-stack-pair",
      title: "Electrical Survey Current Reversal Stack Pair Tool",
      description:
        "Separate a supplied equal-magnitude opposite-current voltage pair into odd signal and even additive offset without estimating resistivity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positiveCurrentVoltage: { type: "number" },
          reversedCurrentVoltage: { type: "number" },
        },
        required: ["positiveCurrentVoltage", "reversedCurrentVoltage"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oddSignal: { type: "number" },
          evenOffset: { type: "number" },
        },
        required: ["oddSignal", "evenOffset"],
      },
      ports: {
        inputs: [
          {
            id: "positiveCurrentVoltage",
            label: "Positive Current Voltage",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reversedCurrentVoltage",
            label: "Reversed Current Voltage",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "oddSignal",
            label: "Odd Signal",
            valueType: { type: "number" },
          },
          {
            id: "evenOffset",
            label: "Even Offset",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electricalSurveyCurrentReversalStackPairTool.execute;
export default electricalSurveyCurrentReversalStackPairTool;
