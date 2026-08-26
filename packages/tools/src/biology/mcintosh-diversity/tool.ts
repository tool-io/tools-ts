import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type McIntoshDiversityInput = {
  readonly countA: number;
  readonly countB: number;
  readonly countC: number;
};

export type McIntoshDiversityOutput = {
  readonly mcintoshDiversity: number;
};

export const mcintoshDiversityExample = {
  input: { countA: 5, countB: 3, countC: 2 },
  output: { mcintoshDiversity: 0.5609449764708457 },
} satisfies ToolExample<McIntoshDiversityInput, McIntoshDiversityOutput>;

export const mcintoshDiversityTool = createSimpleTool({
  id: "biology/mcintosh-diversity",
  title: "McIntosh Index",
  description:
    "Compute the McIntosh diversity index for a three species community from Euclidean distance in species space.",
  inputs: [
    {
      id: "countA",
      kind: "integer",
      label: "Species A count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "countB",
      kind: "integer",
      label: "Species B count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "countC",
      kind: "integer",
      label: "Species C count",
      minimum: 0,
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "mcintoshDiversity",
      kind: "number",
      label: "McIntosh index",
    },
  ],
  calculate: (input) => {
    const countA = input.countA as number;
    const countB = input.countB as number;
    const countC = input.countC as number;
    const n = countA + countB + countC;
    if (n <= 1)
      simpleError(
        "countA",
        "At least two individuals are required for the McIntosh index.",
        "insufficient_samples",
      );
    return {
      mcintoshDiversity:
        (n - Math.sqrt(countA * countA + countB * countB + countC * countC)) /
        (n - Math.sqrt(n)),
    };
  },
});
export const runMcIntoshDiversity = mcintoshDiversityTool.execute;
export default mcintoshDiversityTool;
