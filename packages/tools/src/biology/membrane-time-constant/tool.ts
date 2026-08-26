import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const membraneTimeConstantExample = {
  input: { membraneCapacitanceUf: 2.5, membraneResistanceMohm: 4 },
  output: { timeConstantMs: 10000 },
} satisfies ToolExample<
  {
    readonly membraneCapacitanceUf: number;
    readonly membraneResistanceMohm: number;
  },
  { readonly timeConstantMs: number }
>;

export const membraneTimeConstantTool = createSimpleTool({
  id: "biology/membrane-time-constant",
  title: "Membrane Time Constant",
  description:
    "Compute the passive membrane time constant tau = R x C, converting megaohm-microfarads (seconds) to milliseconds.",
  inputs: [
    {
      description:
        "Membrane resistance in megaohms; must be greater than zero.",
      id: "membraneResistanceMohm",
      label: "Membrane resistance",
      kind: "number",
      unit: "MΩ",
    },
    {
      description:
        "Membrane capacitance in microfarads; must be greater than zero.",
      id: "membraneCapacitanceUf",
      label: "Membrane capacitance",
      kind: "number",
      unit: "µF",
    },
  ],
  outputs: [
    {
      description: "Membrane time constant in milliseconds.",
      id: "timeConstantMs",
      label: "Time constant",
      kind: "number",
      unit: "ms",
    },
  ],
  calculate: (input) => {
    const membraneResistanceMohm = input.membraneResistanceMohm as number;
    const membraneCapacitanceUf = input.membraneCapacitanceUf as number;
    if (!(membraneResistanceMohm > 0))
      simpleError(
        "membraneResistanceMohm",
        "The membrane resistance must be greater than zero.",
      );
    if (!(membraneCapacitanceUf > 0))
      simpleError(
        "membraneCapacitanceUf",
        "The membrane capacitance must be greater than zero.",
      );
    return {
      timeConstantMs: membraneResistanceMohm * membraneCapacitanceUf * 1000,
    };
  },
});
export const runMembraneTimeConstant = membraneTimeConstantTool.execute;
export default membraneTimeConstantTool;
