import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const resonanceCountTool = createSimpleTool({
  id: "chemistry/resonance-count",
  title: "Resonance Count Tool",
  description: "Count the number of specified resonance structures.",
  inputs: [
    {
      description: "Number of valid resonance structures drawn.",
      id: "structuresSpecified",
      kind: "integer",
      label: "Structures",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total resonance structure count.",
      id: "count",
      kind: "integer",
      label: "Count",
    },
  ],
  calculate: (input) => {
    return { count: input.structuresSpecified as number };
  },
});
export const runResonanceCount = resonanceCountTool.execute;
export default resonanceCountTool;

export type ResonanceCountInput = {
  readonly structuresSpecified: number;
};

export type ResonanceCountOutput = {
  readonly count: number;
};

export const resonanceCountExample = {
  input: {
    structuresSpecified: 1,
  },
  output: {
    count: 1,
  },
} satisfies ToolExample<ResonanceCountInput, ResonanceCountOutput>;
