import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChromatographySelectivityInput = {
  readonly kPrimeA: number;
  readonly kPrimeB: number;
};

export type ChromatographySelectivityOutput = {
  readonly selectivityAlpha: number;
};

export const chromatographySelectivityExample = {
  input: { kPrimeA: 2, kPrimeB: 4 },
  output: { selectivityAlpha: 2 },
} satisfies ToolExample<
  ChromatographySelectivityInput,
  ChromatographySelectivityOutput
>;

export const chromatographySelectivityTool = createSimpleTool({
  id: "chemistry/chromatography-selectivity",
  title: "Selectivity Alpha",
  description:
    "Compute chromatographic selectivity alpha as the retention factor of peak B divided by the retention factor of peak A.",
  inputs: [
    { id: "kPrimeA", label: "Retention factor of A", kind: "number" },
    { id: "kPrimeB", label: "Retention factor of B", kind: "number" },
  ],
  outputs: [{ id: "selectivityAlpha", label: "Selectivity", kind: "number" }],
  calculate: (input) => {
    const kPrimeA = input.kPrimeA as number;
    const kPrimeB = input.kPrimeB as number;
    if (!(kPrimeA > 0))
      simpleError(
        "kPrimeA",
        "Retention factor of A must be positive.",
        "invalid_retention_factor",
      );
    if (!(kPrimeB > 0))
      simpleError(
        "kPrimeB",
        "Retention factor of B must be positive.",
        "invalid_retention_factor",
      );
    return { selectivityAlpha: kPrimeB / kPrimeA };
  },
});
export const runChromatographySelectivity =
  chromatographySelectivityTool.execute;
export default chromatographySelectivityTool;
