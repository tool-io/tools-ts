import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly roundTripTimingUncertaintySeconds: number;
}>;
export type Output = Readonly<{
  readonly oneWayRangeUncertaintyMeters: number;
  readonly oneWayRangeUncertaintyCentimeters: number;
}>;

export const calculate = (input: Input): Output => {
  const oneWayRangeUncertaintyMeters =
    (299792458 * input.roundTripTimingUncertaintySeconds) / 2;
  return {
    oneWayRangeUncertaintyMeters,
    oneWayRangeUncertaintyCentimeters: oneWayRangeUncertaintyMeters * 100,
  };
};

export const exampleInput = {
  roundTripTimingUncertaintySeconds: 1e-10,
} satisfies Input;
export const exampleOutput = {
  oneWayRangeUncertaintyMeters: 0.014989622900000001,
  oneWayRangeUncertaintyCentimeters: 1.4989622900000001,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      roundTripTimingUncertaintySeconds:
        input.roundTripTimingUncertaintySeconds as number,
    }),
  description:
    "Convert round-trip timing uncertainty into one-way lunar-ranging distance uncertainty.",
  id: "laser/lunar-ranging-precision",
  inputs: [
    {
      id: "roundTripTimingUncertaintySeconds",
      label: "Round-trip timing uncertainty",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [
    {
      id: "oneWayRangeUncertaintyMeters",
      label: "One-way range uncertainty",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "oneWayRangeUncertaintyCentimeters",
      label: "One-way range uncertainty",
      kind: "number",
      minimum: 0,
      unit: "cm",
    },
  ],
  title: "Lunar-Ranging Precision",
});

export const run = tool.execute;
export default tool;
