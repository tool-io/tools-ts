import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dioptricPowerChange: number;
  readonly pumpPowerChangeWatts: number;
}>;
export type Output = Readonly<{
  readonly dioptricPowerPerWatt: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.pumpPowerChangeWatts === 0)
    simpleError(
      "pumpPowerChangeWatts",
      "Pump-power change must not be zero.",
      "division_by_zero",
    );
  return {
    dioptricPowerPerWatt:
      input.dioptricPowerChange / input.pumpPowerChangeWatts,
  };
};

export const exampleInput = {
  dioptricPowerChange: 2,
  pumpPowerChangeWatts: 10,
} satisfies Input;
export const exampleOutput = { dioptricPowerPerWatt: 0.2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      dioptricPowerChange: input.dioptricPowerChange as number,
      pumpPowerChangeWatts: input.pumpPowerChangeWatts as number,
    }),
  description:
    "Calculate measured thermal-lens dioptric-power change per watt of pump-power change.",
  id: "laser/thermal-lens-coefficient",
  inputs: [
    {
      id: "dioptricPowerChange",
      label: "Thermal-lens dioptric change",
      kind: "number",
      unit: "D",
    },
    {
      id: "pumpPowerChangeWatts",
      label: "Pump-power change",
      kind: "number",
      unit: "W",
    },
  ],
  outputs: [
    {
      id: "dioptricPowerPerWatt",
      label: "Thermal-lens coefficient",
      kind: "number",
      unit: "D/W",
    },
  ],
  title: "Thermal-Lens Coefficient",
});

export const run = tool.execute;
export default tool;
