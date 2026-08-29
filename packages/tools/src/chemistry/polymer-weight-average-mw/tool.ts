import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { counts: [2, 1], molarMasses: [100, 200] },
  output: { weightAverageMolarMass: 150 },
} satisfies ToolExample<
  { readonly counts: number[]; readonly molarMasses: number[] },
  { readonly weightAverageMolarMass: number }
>;
export const tool = createSimpleTool({
  id: "chemistry/polymer-weight-average-mw",
  title: "Polymer Weight-Average Molecular Mass",
  description:
    "Calculate Mw=ΣNiMi²/ΣNiMi from a polymer chain-count distribution. Heavy chains contribute disproportionately, so Mw is normally at least Mn for the same distribution.",
  inputs: [
    { id: "counts", kind: "numberList", label: "Chain counts by mass bin" },
    { id: "molarMasses", kind: "numberList", label: "Molar masses by bin" },
  ],
  outputs: [
    {
      id: "weightAverageMolarMass",
      kind: "number",
      label: "Polymer Weight-Average Molecular Mass",
    },
  ],
  calculate: (input) => {
    const counts = input.counts as number[];
    const masses = input.molarMasses as number[];
    if (counts.length === 0 || counts.length !== masses.length)
      simpleError("counts", "Supply one nonempty count for each molar mass.");
    if (counts.some((n) => n < 0) || masses.some((m) => m <= 0))
      simpleError(
        "molarMasses",
        "Counts must be nonnegative and molar masses positive.",
      );
    let count = 0,
      weighted = 0,
      weighted2 = 0;
    for (let j = 0; j < counts.length; j++) {
      count += counts[j];
      weighted += counts[j] * masses[j];
      weighted2 += counts[j] * masses[j] * masses[j];
    }
    if (count <= 0 || weighted <= 0)
      simpleError("counts", "At least one positive chain count is required.");
    const value = weighted2 / weighted;
    if (!Number.isFinite(value))
      simpleError("counts", "Distribution exceeds the numeric range.");
    return { weightAverageMolarMass: value };
  },
});
export type PolymerWeightAverageMwInput = Readonly<typeof example.input>;
export type PolymerWeightAverageMwOutput = Readonly<typeof example.output>;
export const polymerWeightAverageMwTool = tool;
export const runPolymerWeightAverageMw = tool.execute;
export default tool;
