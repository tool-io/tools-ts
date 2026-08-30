import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BodRemovalEfficiencyInput = Readonly<{
  readonly influentMilligramsPerLiter: number;
  readonly effluentMilligramsPerLiter: number;
}>;
export type BodRemovalEfficiencyOutput = Readonly<{
  readonly removalPercent: number;
}>;

export const calculateBodRemovalEfficiency = (
  x: BodRemovalEfficiencyInput,
): BodRemovalEfficiencyOutput => {
  if (
    !Number.isFinite(x.influentMilligramsPerLiter) ||
    x.influentMilligramsPerLiter < 0
  )
    simpleError(
      "influentMilligramsPerLiter",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.effluentMilligramsPerLiter) ||
    x.effluentMilligramsPerLiter < 0
  )
    simpleError(
      "effluentMilligramsPerLiter",
      "Provide a finite number at least 0.",
    );
  if (x.effluentMilligramsPerLiter > x.influentMilligramsPerLiter)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const removalPercent =
    (100 * (x.influentMilligramsPerLiter - x.effluentMilligramsPerLiter)) /
    x.influentMilligramsPerLiter;
  if (!Number.isFinite(removalPercent))
    simpleError(
      "removalPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { removalPercent: Object.is(removalPercent, -0) ? 0 : removalPercent };
};

export const example = {
  input: { influentMilligramsPerLiter: 200, effluentMilligramsPerLiter: 20 },
  output: { removalPercent: 90 },
} satisfies ToolExample<BodRemovalEfficiencyInput, BodRemovalEfficiencyOutput>;

export const tool = createSimpleTool({
  id: "engineering/bod-removal-efficiency",
  title: "BOD Removal Efficiency",
  description:
    "BOD removal percentage from influent and effluent concentrations sampled on a comparable basis.",
  inputs: [
    {
      id: "influentMilligramsPerLiter",
      kind: "number",
      label: "Influent Milligrams Per Liter",
      unit: "mg/L",
      minimum: 0,
    },
    {
      id: "effluentMilligramsPerLiter",
      kind: "number",
      label: "Effluent Milligrams Per Liter",
      unit: "mg/L",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "removalPercent",
      kind: "number",
      label: "Removal Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateBodRemovalEfficiency({
      influentMilligramsPerLiter: input.influentMilligramsPerLiter as number,
      effluentMilligramsPerLiter: input.effluentMilligramsPerLiter as number,
    }),
});
export const bodRemovalEfficiencyTool = tool;
export const runBodRemovalEfficiency = tool.execute;
export default tool;
