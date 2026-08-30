import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationBattsCoverageInput = Readonly<{
  readonly packCount: number;
  readonly coveragePerPackM2: number;
}>;
export type InsulationBattsCoverageOutput = Readonly<{
  readonly coveredAreaM2: number;
}>;

export const calculateInsulationBattsCoverage = (
  x: InsulationBattsCoverageInput,
): InsulationBattsCoverageOutput => {
  if (!Number.isSafeInteger(x.packCount) || x.packCount < 0)
    simpleError("packCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.coveragePerPackM2) || x.coveragePerPackM2 < 0)
    simpleError("coveragePerPackM2", "Provide a finite number at least 0.");
  const coveredAreaM2 = x.packCount * x.coveragePerPackM2;
  if (!Number.isFinite(coveredAreaM2))
    simpleError("coveredAreaM2", "The inputs produce an invalid result.");
  return { coveredAreaM2: Object.is(coveredAreaM2, -0) ? 0 : coveredAreaM2 };
};

export const example = {
  input: { packCount: 4, coveragePerPackM2: 12 },
  output: { coveredAreaM2: 48 },
} satisfies ToolExample<
  InsulationBattsCoverageInput,
  InsulationBattsCoverageOutput
>;

export const tool = createSimpleTool({
  id: "construction/insulation-batts-coverage",
  title: "Insulation Batts Coverage",
  description:
    "Multiply batt packs by the effective installed area covered by each pack.",
  inputs: [
    { id: "packCount", kind: "integer", label: "Batt packs", minimum: 0 },
    {
      id: "coveragePerPackM2",
      kind: "number",
      label: "Coverage per pack",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "coveredAreaM2",
      kind: "number",
      label: "Total covered area",
      unit: "m²",
    },
  ],
  calculate: (input) =>
    calculateInsulationBattsCoverage({
      packCount: input.packCount as number,
      coveragePerPackM2: input.coveragePerPackM2 as number,
    }),
});
export const insulationBattsCoverageTool = tool;
export const runInsulationBattsCoverage = tool.execute;
export default tool;
