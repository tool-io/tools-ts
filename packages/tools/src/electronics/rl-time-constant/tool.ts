import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RlTimeConstantInput = {
  readonly inductanceH: number;
  readonly resistanceOhms: number;
};

export type RlTimeConstantOutput = {
  readonly timeConstantS: number;
};

export const rlTimeConstantExample = {
  input: {
    inductanceH: 0.05,
    resistanceOhms: 100,
  },
  output: { timeConstantS: 0.0005 },
} satisfies ToolExample<RlTimeConstantInput, RlTimeConstantOutput>;

export const calculateRlTimeConstant = (
  input: RlTimeConstantInput,
): RlTimeConstantOutput => {
  if (input.inductanceH <= 0 || input.resistanceOhms <= 0)
    simpleError(
      "inductanceH",
      "Inductance and resistance must be positive.",
      "invalid_input",
    );
  return { timeConstantS: input.inductanceH / input.resistanceOhms };
};

export const rlTimeConstantTool = createSimpleTool({
  calculate: (input) =>
    calculateRlTimeConstant(input as unknown as RlTimeConstantInput),
  description:
    "Compute the RL circuit time constant tau = L / R; the current reaches about 63 percent of its final value after one tau and is effectively settled after five.",
  id: "electronics/rl-time-constant",
  inputs: [
    {
      description: "Circuit inductance.",
      id: "inductanceH",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
    {
      description: "Series resistance seen by the inductor.",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Time constant tau in seconds.",
      format: "duration-s",
      id: "timeConstantS",
      kind: "number",
      label: "Tau",
      unit: "s",
    },
  ],
  title: "RL Time Constant Calculator",
});
export const runRlTimeConstant = rlTimeConstantTool.execute;
export default rlTimeConstantTool;
