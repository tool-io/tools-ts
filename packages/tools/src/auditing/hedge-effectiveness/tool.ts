import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly hedgedItemChange: number;
  readonly hedgingInstrumentChange: number;
  readonly minimumEffectivenessPercent: number;
  readonly maximumEffectivenessPercent: number;
}>;
export type Output = Readonly<{
  readonly offsetRatioPercent: number;
  readonly ineffectivenessAmount: number;
  readonly effective: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.hedgedItemChange === 0)
    simpleError(
      "hedgedItemChange",
      "Hedged-item change must not be zero.",
      "invalid_baseline",
    );
  const offsetRatioPercent =
      Math.abs(input.hedgingInstrumentChange / input.hedgedItemChange) * 100,
    ineffectivenessAmount =
      input.hedgedItemChange + input.hedgingInstrumentChange;
  return {
    offsetRatioPercent,
    ineffectivenessAmount,
    effective:
      offsetRatioPercent >= input.minimumEffectivenessPercent &&
      offsetRatioPercent <= input.maximumEffectivenessPercent,
  };
};

export const exampleInput = {
  hedgedItemChange: 100,
  hedgingInstrumentChange: -95,
  minimumEffectivenessPercent: 80,
  maximumEffectivenessPercent: 125,
} satisfies Input;
export const exampleOutput = {
  offsetRatioPercent: 95,
  ineffectivenessAmount: 5,
  effective: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      hedgedItemChange: input.hedgedItemChange as number,
      hedgingInstrumentChange: input.hedgingInstrumentChange as number,
      minimumEffectivenessPercent: input.minimumEffectivenessPercent as number,
      maximumEffectivenessPercent: input.maximumEffectivenessPercent as number,
    }),
  description:
    "Measure hedge offset effectiveness against caller-supplied bounds.",
  id: "auditing/hedge-effectiveness",
  inputs: [
    {
      id: "hedgedItemChange",
      label: "Hedged-item value change",
      kind: "number",
    },
    {
      id: "hedgingInstrumentChange",
      label: "Hedging-instrument value change",
      kind: "number",
    },
    {
      id: "minimumEffectivenessPercent",
      label: "Minimum effectiveness",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "maximumEffectivenessPercent",
      label: "Maximum effectiveness",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "offsetRatioPercent",
      label: "Absolute offset ratio",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "ineffectivenessAmount",
      label: "Residual ineffectiveness",
      kind: "number",
    },
    {
      id: "effective",
      label: "Within supplied effectiveness range",
      kind: "boolean",
    },
  ],
  title: "Hedge Effectiveness",
});

export const run = tool.execute;
export default tool;
