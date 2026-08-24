import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchutzIndexInput = {
  readonly incomes: readonly number[];
};

export type SchutzIndexOutput = {
  readonly schutzIndex: number;
};

export const schutzIndexExample = {
  input: {
    incomes: [1, 3, 5],
  },
  output: {
    schutzIndex: 0.2222222222222222,
  },
} satisfies ToolExample<SchutzIndexInput, SchutzIndexOutput>;

export const calculateSchutzIndex = (
  input: SchutzIndexInput,
): SchutzIndexOutput => {
  const count = input.incomes.length;
  if (count === 0)
    simpleError("incomes", "The sample cannot be empty.", "invalid_value");
  if (input.incomes.some((income) => !Number.isFinite(income) || income < 0))
    simpleError(
      "incomes",
      "Income values must be finite nonnegative numbers.",
      "invalid_value",
    );
  const mean = input.incomes.reduce((sum, value) => sum + value, 0) / count;
  if (mean <= 0)
    simpleError(
      "incomes",
      "The mean income must be positive to form the Schutz index.",
      "invalid_value",
    );
  const belowMeanGap = input.incomes.reduce(
    (gap, value) => gap + Math.max(0, mean - value),
    0,
  );
  return {
    schutzIndex: belowMeanGap / (count * mean),
  };
};

export const schutzIndexTool = createSimpleTool({
  calculate: (input) =>
    calculateSchutzIndex({ incomes: input.incomes as readonly number[] }),
  description:
    "Compute the Schutz inequality index as the below-mean income shortfall divided by total income.",
  id: "sociology/schutz-index",
  inputs: [
    {
      description: "Income values in the sample.",
      id: "incomes",
      kind: "numberList",
      label: "Incomes",
    },
  ],
  outputs: [
    {
      description:
        "Below-mean shortfall divided by total potential income; larger means wider felt deprivation.",
      id: "schutzIndex",
      kind: "number",
      label: "Schutz index",
    },
  ],
  title: "Schutz Index Calculator",
});
export const runSchutzIndex = schutzIndexTool.execute;
export default schutzIndexTool;
