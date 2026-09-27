import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hitProbit: number;
  readonly falseAlarmProbit: number;
};
export type Output = { readonly dPrime: number; readonly criterion: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hitProbit: { type: "number" },
    falseAlarmProbit: { type: "number" },
  },
  required: ["hitProbit", "falseAlarmProbit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dPrime: { type: "number" }, criterion: { type: "number" } },
  required: ["dPrime", "criterion"],
} as const;
/** Equal-variance Gaussian signal-detection d-prime and criterion from caller-supplied finite z-scores, not uncorrected endpoint rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hitProbit, falseAlarmProbit } = request;
  const compute = (): Output => {
    return {
      dPrime: hitProbit - falseAlarmProbit,
      criterion: -(hitProbit + falseAlarmProbit) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hitProbit: 1, falseAlarmProbit: -1 },
  output: { dPrime: 2, criterion: 0 },
} satisfies ToolExample<Input, Output>;
export const signalDetectionDprimeOneProbitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/signal-detection-dprime-one-probit-gap",
    title: "Signal Detection Dprime One Probit Gap Tool",
    description:
      "Equal-variance Gaussian signal-detection d-prime and criterion from caller-supplied finite z-scores, not uncorrected endpoint rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hitProbit: { type: "number" },
        falseAlarmProbit: { type: "number" },
      },
      required: ["hitProbit", "falseAlarmProbit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dPrime: { type: "number" }, criterion: { type: "number" } },
      required: ["dPrime", "criterion"],
    },
    ports: {
      inputs: [
        {
          id: "hitProbit",
          label: "Hit Probit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "falseAlarmProbit",
          label: "False Alarm Probit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dPrime", label: "D Prime", valueType: { type: "number" } },
        { id: "criterion", label: "Criterion", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = signalDetectionDprimeOneProbitGapTool.execute;
export default signalDetectionDprimeOneProbitGapTool;
