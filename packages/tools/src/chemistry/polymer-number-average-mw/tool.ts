import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { counts: [2, 1], molarMasses: [100, 200] },
  output: { numberAverageMolarMass: 133.33333333333334 },
} satisfies ToolExample<
  { readonly counts: number[]; readonly molarMasses: number[] },
  { readonly numberAverageMolarMass: number }
>;
export const tool = createSimpleTool({
  id: "chemistry/polymer-number-average-mw",
  title: "Polymer Number-Average Molecular Mass",
  description:
    "Calculate Mn=ΣNiMi/ΣNi from counts of polymer chains in each molar-mass bin. Counts and masses must have equal, nonempty lengths; masses should use a consistent unit.",
  inputs: [
    { id: "counts", kind: "numberList", label: "Chain counts by mass bin" },
    { id: "molarMasses", kind: "numberList", label: "Molar masses by bin" },
  ],
  outputs: [
    {
      id: "numberAverageMolarMass",
      kind: "number",
      label: "Polymer Number-Average Molecular Mass",
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
    const value = weighted / count;
    if (!Number.isFinite(value))
      simpleError("counts", "Distribution exceeds the numeric range.");
    return { numberAverageMolarMass: value };
  },
});
export type PolymerNumberAverageMwInput = Readonly<typeof example.input>;
export type PolymerNumberAverageMwOutput = Readonly<typeof example.output>;
export const polymerNumberAverageMwTool = tool;
export const runPolymerNumberAverageMw = tool.execute;
export default tool;
