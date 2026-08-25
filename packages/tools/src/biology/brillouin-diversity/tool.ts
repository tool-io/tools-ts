import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const logFactorial = (value: number): number => {
  let result = 0;
  for (let i = 2; i <= value; i += 1) result += Math.log(i);
  return result;
};

export type BrillouinDiversityInput = {
  readonly countA: number;
  readonly countB: number;
  readonly countC: number;
};

export type BrillouinDiversityOutput = {
  readonly brillouinIndex: number;
};

export const brillouinDiversityExample = {
  input: { countA: 10, countB: 10, countC: 5 },
  output: { brillouinIndex: 0.9202915333618978 },
} satisfies ToolExample<BrillouinDiversityInput, BrillouinDiversityOutput>;

export const brillouinDiversityTool = createSimpleTool({
  id: "biology/brillouin-diversity",
  title: "Brillouin Index",
  description:
    "Compute the Brillouin diversity index HB = (ln(N!) - sum(ln(ni!))) / N from three species counts using loop-based log factorials for communities up to 10000 individuals.",
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
      id: "brillouinIndex",
      kind: "number",
      label: "Brillouin index",
    },
  ],
  calculate: (input) => {
    const counts = [
      input.countA as number,
      input.countB as number,
      input.countC as number,
    ];
    const total = counts[0] + counts[1] + counts[2];
    if (total === 0)
      simpleError(
        "countA",
        "At least one individual is required.",
        "empty_community",
      );
    if (total > 10000)
      simpleError(
        "countA",
        "The community exceeds the supported size of 10000 individuals.",
        "community_too_large",
      );
    let sumLogFactorials = 0;
    for (const count of counts)
      if (count > 0) sumLogFactorials += logFactorial(count);
    return {
      brillouinIndex: (logFactorial(total) - sumLogFactorials) / total,
    };
  },
});
export const runBrillouinDiversity = brillouinDiversityTool.execute;
export default brillouinDiversityTool;
