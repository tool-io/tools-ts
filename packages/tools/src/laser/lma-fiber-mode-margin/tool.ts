import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fundamentalLossDbPerMeter: number;
  readonly homLossDbPerMeter: number;
  readonly deliveryLengthMeters: number;
  readonly requiredHomSuppressionDb: number;
}>;
export type Output = Readonly<{
  readonly homSuppressionDb: number;
  readonly suppressionMarginDb: number;
  readonly fundamentalTransmissionPercent: number;
  readonly meetsSuppression: boolean;
}>;

export const calculate = (input: Input): Output => {
  const homSuppressionDb =
    (input.homLossDbPerMeter - input.fundamentalLossDbPerMeter) *
    input.deliveryLengthMeters;
  return {
    homSuppressionDb,
    suppressionMarginDb: homSuppressionDb - input.requiredHomSuppressionDb,
    fundamentalTransmissionPercent:
      100 *
      10 **
        ((-input.fundamentalLossDbPerMeter * input.deliveryLengthMeters) / 10),
    meetsSuppression: homSuppressionDb >= input.requiredHomSuppressionDb,
  };
};

export const exampleInput = {
  fundamentalLossDbPerMeter: 0,
  homLossDbPerMeter: 2,
  deliveryLengthMeters: 5,
  requiredHomSuppressionDb: 8,
} satisfies Input;
export const exampleOutput = {
  homSuppressionDb: 10,
  suppressionMarginDb: 2,
  fundamentalTransmissionPercent: 100,
  meetsSuppression: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fundamentalLossDbPerMeter: input.fundamentalLossDbPerMeter as number,
      homLossDbPerMeter: input.homLossDbPerMeter as number,
      deliveryLengthMeters: input.deliveryLengthMeters as number,
      requiredHomSuppressionDb: input.requiredHomSuppressionDb as number,
    }),
  description:
    "Check large-mode-area fiber higher-order-mode suppression and fundamental transmission.",
  id: "laser/lma-fiber-mode-margin",
  inputs: [
    {
      id: "fundamentalLossDbPerMeter",
      label: "Fundamental-mode loss",
      kind: "number",
      minimum: 0,
      unit: "dB/m",
    },
    {
      id: "homLossDbPerMeter",
      label: "Higher-order-mode loss",
      kind: "number",
      minimum: 0,
      unit: "dB/m",
    },
    {
      id: "deliveryLengthMeters",
      label: "Delivery length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "requiredHomSuppressionDb",
      label: "Required HOM suppression",
      kind: "number",
      minimum: 0,
      unit: "dB",
    },
  ],
  outputs: [
    {
      id: "homSuppressionDb",
      label: "Differential HOM suppression",
      kind: "number",
      unit: "dB",
    },
    {
      id: "suppressionMarginDb",
      label: "Suppression margin",
      kind: "number",
      unit: "dB",
    },
    {
      id: "fundamentalTransmissionPercent",
      label: "Fundamental transmission",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "meetsSuppression",
      label: "Meets suppression requirement",
      kind: "boolean",
    },
  ],
  title: "LMA Fiber Mode Margin",
});

export const run = tool.execute;
export default tool;
