import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successBenefit: number;
  readonly baselineSuccess: number;
  readonly deviceSuccess: number;
  readonly fee: number;
};
export type Output = {
  readonly benefitIncrease: number;
  readonly netExpectedGain: number;
  readonly breakEvenFee: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successBenefit: { type: "number", minimum: 0 },
    baselineSuccess: { type: "number", minimum: 0, maximum: 1 },
    deviceSuccess: { type: "number", minimum: 0, maximum: 1 },
    fee: { type: "number", minimum: 0 },
  },
  required: ["successBenefit", "baselineSuccess", "deviceSuccess", "fee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    benefitIncrease: { type: "number" },
    netExpectedGain: { type: "number" },
    breakEvenFee: { type: "number" },
  },
  required: ["benefitIncrease", "netExpectedGain", "breakEvenFee"],
} as const;
/** Calculate commitment device fee break even term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successBenefit, baselineSuccess, deviceSuccess, fee } = request;
  const compute = (): Output => {
    H.domain(successBenefit >= 0 && fee >= 0);
    H.probability(baselineSuccess);
    H.probability(deviceSuccess);
    return {
      benefitIncrease: successBenefit * (deviceSuccess - baselineSuccess),
      netExpectedGain: successBenefit * (deviceSuccess - baselineSuccess) - fee,
      breakEvenFee: successBenefit * (deviceSuccess - baselineSuccess),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    successBenefit: 100,
    baselineSuccess: 0.4,
    deviceSuccess: 0.7,
    fee: 20,
  },
  output: {
    benefitIncrease: 29.999999999999993,
    netExpectedGain: 9.999999999999993,
    breakEvenFee: 29.999999999999993,
  },
} satisfies ToolExample<Input, Output>;
export const commitmentDeviceFeeBreakEvenTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/commitment-device-fee-break-even-term",
    title: "Commitment Device Fee Break Even Term Tool",
    description:
      "Calculate commitment device fee break even term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successBenefit: { type: "number", minimum: 0 },
        baselineSuccess: { type: "number", minimum: 0, maximum: 1 },
        deviceSuccess: { type: "number", minimum: 0, maximum: 1 },
        fee: { type: "number", minimum: 0 },
      },
      required: ["successBenefit", "baselineSuccess", "deviceSuccess", "fee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        benefitIncrease: { type: "number" },
        netExpectedGain: { type: "number" },
        breakEvenFee: { type: "number" },
      },
      required: ["benefitIncrease", "netExpectedGain", "breakEvenFee"],
    },
    ports: {
      inputs: [
        {
          id: "successBenefit",
          label: "Success Benefit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineSuccess",
          label: "Baseline Success",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deviceSuccess",
          label: "Device Success",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fee",
          label: "Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "benefitIncrease",
          label: "Benefit Increase",
          valueType: { type: "number" },
        },
        {
          id: "netExpectedGain",
          label: "Net Expected Gain",
          valueType: { type: "number" },
        },
        {
          id: "breakEvenFee",
          label: "Break Even Fee",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = commitmentDeviceFeeBreakEvenTermTool.execute;
export default commitmentDeviceFeeBreakEvenTermTool;
