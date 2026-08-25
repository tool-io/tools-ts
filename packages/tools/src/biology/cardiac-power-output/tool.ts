import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CardiacPowerOutputInput = {
  readonly cardiacOutputLPerMin: number;
  readonly meanArterialMmhg: number;
};

export type CardiacPowerOutputOutput = {
  readonly cardiacPowerOutputWatts: number;
};

export const cardiacPowerOutputExample = {
  input: { cardiacOutputLPerMin: 5, meanArterialMmhg: 90 },
  output: { cardiacPowerOutputWatts: 0.9990000000000001 },
} satisfies ToolExample<CardiacPowerOutputInput, CardiacPowerOutputOutput>;

export const cardiacPowerOutputTool = createSimpleTool({
  id: "biology/cardiac-power-output",
  title: "Cardiac Power Output",
  description:
    "Compute cardiac power output from cardiac output and mean arterial pressure.",
  inputs: [
    {
      id: "cardiacOutputLPerMin",
      kind: "number",
      label: "Cardiac output",
      minimum: Number.MIN_VALUE,
      unit: "L/min",
    },
    {
      id: "meanArterialMmhg",
      kind: "number",
      label: "Mean arterial pressure",
      minimum: Number.MIN_VALUE,
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "cardiacPowerOutputWatts",
      kind: "number",
      label: "Cardiac power output",
      unit: "W",
    },
  ],
  calculate: (input) => ({
    cardiacPowerOutputWatts:
      (input.cardiacOutputLPerMin as number) *
      (input.meanArterialMmhg as number) *
      0.00222,
  }),
});
export const runCardiacPowerOutput = cardiacPowerOutputTool.execute;
export default cardiacPowerOutputTool;
