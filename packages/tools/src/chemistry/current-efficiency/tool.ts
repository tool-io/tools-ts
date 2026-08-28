import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const CurrentEfficiencyTool = createSimpleTool({
  id: "chemistry/current-efficiency",
  title: "Current Efficiency Calculator",
  description: "Compute current efficiency percentage.",
  inputs: [
    { id: "actualOutput", label: "Actual output", kind: "number", minimum: 0 },
    {
      id: "theoreticalOutput",
      label: "Theoretical output",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "efficiencyPercent", label: "Efficiency", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const theo = input.theoreticalOutput as number;
    if (theo <= 0)
      simpleError("theoreticalOutput", "> 0 required.", "invalid_theoretical");
    return { efficiencyPercent: ((input.actualOutput as number) / theo) * 100 };
  },
});
export default CurrentEfficiencyTool;
export const runCurrentEfficiency = CurrentEfficiencyTool.execute;

export type CurrentEfficiencyInput = {
  readonly actualOutput: number;
  readonly theoreticalOutput: number;
};

export type CurrentEfficiencyOutput = {
  readonly efficiencyPercent: number;
};

export const currentEfficiencyExample = {
  input: {
    actualOutput: 1,
    theoreticalOutput: 1,
  },
  output: {
    efficiencyPercent: 100,
  },
} satisfies ToolExample<CurrentEfficiencyInput, CurrentEfficiencyOutput>;
