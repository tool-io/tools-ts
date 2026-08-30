import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WasteRecyclingPercentageInput = Readonly<{
  readonly recycledKilograms: number;
  readonly totalKilograms: number;
}>;
export type WasteRecyclingPercentageOutput = Readonly<{
  readonly recycledPercent: number;
}>;

export const calculateWasteRecyclingPercentage = (
  x: WasteRecyclingPercentageInput,
): WasteRecyclingPercentageOutput => {
  if (!Number.isFinite(x.recycledKilograms) || x.recycledKilograms < 0)
    simpleError("recycledKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.totalKilograms) || x.totalKilograms < 0)
    simpleError("totalKilograms", "Provide a finite number at least 0.");
  if (x.recycledKilograms > x.totalKilograms)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const recycledPercent = (100 * x.recycledKilograms) / x.totalKilograms;
  if (!Number.isFinite(recycledPercent))
    simpleError(
      "recycledPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    recycledPercent: Object.is(recycledPercent, -0) ? 0 : recycledPercent,
  };
};

export const example = {
  input: { recycledKilograms: 800, totalKilograms: 1000 },
  output: { recycledPercent: 80 },
} satisfies ToolExample<
  WasteRecyclingPercentageInput,
  WasteRecyclingPercentageOutput
>;

export const tool = createSimpleTool({
  id: "construction/waste-recycling-percentage",
  title: "Waste Recycling Percentage",
  description:
    "Recycled share of construction waste by mass from documented recycled mass and total generated waste mass.",
  inputs: [
    {
      id: "recycledKilograms",
      kind: "number",
      label: "Recycled Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "totalKilograms",
      kind: "number",
      label: "Total Kilograms",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "recycledPercent",
      kind: "number",
      label: "Recycled Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateWasteRecyclingPercentage({
      recycledKilograms: input.recycledKilograms as number,
      totalKilograms: input.totalKilograms as number,
    }),
});
export const wasteRecyclingPercentageTool = tool;
export const runWasteRecyclingPercentage = tool.execute;
export default tool;
