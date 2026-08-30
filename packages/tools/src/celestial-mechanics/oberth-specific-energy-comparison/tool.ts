import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly periapsisSpeed: number;
  readonly comparisonSpeed: number;
  readonly progradeDeltaV: number;
}>;
export type Output = Readonly<{
  readonly periapsisEnergyGain: number;
  readonly comparisonEnergyGain: number;
  readonly energyGainMultiplier: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.periapsisSpeed, "periapsisSpeed");
  nonnegative(input.comparisonSpeed, "comparisonSpeed");
  positive(input.progradeDeltaV, "progradeDeltaV");
  const periapsisEnergyGain =
      input.periapsisSpeed * input.progradeDeltaV +
      input.progradeDeltaV ** 2 / 2,
    comparisonEnergyGain =
      input.comparisonSpeed * input.progradeDeltaV +
      input.progradeDeltaV ** 2 / 2;
  return {
    periapsisEnergyGain,
    comparisonEnergyGain,
    energyGainMultiplier: periapsisEnergyGain / comparisonEnergyGain,
  };
};
export const exampleInput = {
  periapsisSpeed: 30,
  comparisonSpeed: 10,
  progradeDeltaV: 2,
} satisfies Input;
export const exampleOutput = {
  periapsisEnergyGain: 62,
  comparisonEnergyGain: 22,
  energyGainMultiplier: 2.8181818181818183,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/oberth-specific-energy-comparison",
  title: "Oberth Specific Energy Comparison",
  description:
    "Compare specific orbital-energy gains from the same instantaneous prograde burn at two supplied speeds.",
  inputs: [
    { id: "periapsisSpeed", label: "Periapsis speed", kind: "number" },
    { id: "comparisonSpeed", label: "Comparison speed", kind: "number" },
    { id: "progradeDeltaV", label: "Prograde delta v", kind: "number" },
  ],
  outputs: [
    {
      id: "periapsisEnergyGain",
      label: "Periapsis energy gain",
      kind: "number",
    },
    {
      id: "comparisonEnergyGain",
      label: "Comparison energy gain",
      kind: "number",
    },
    {
      id: "energyGainMultiplier",
      label: "Energy gain multiplier",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      periapsisSpeed: value.periapsisSpeed as number,
      comparisonSpeed: value.comparisonSpeed as number,
      progradeDeltaV: value.progradeDeltaV as number,
    }),
});
export const run = tool.execute;
export default tool;
