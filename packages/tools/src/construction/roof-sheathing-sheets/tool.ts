import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofSheathingSheetsInput = Readonly<{
  readonly roofSquareMeters: number;
  readonly sheetSquareMeters: number;
  readonly wastePercent: number;
}>;
export type RoofSheathingSheetsOutput = Readonly<{
  readonly sheetCount: number;
}>;

export const calculateRoofSheathingSheets = (
  x: RoofSheathingSheetsInput,
): RoofSheathingSheetsOutput => {
  if (!Number.isFinite(x.roofSquareMeters) || x.roofSquareMeters < 0)
    simpleError("roofSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sheetSquareMeters) || x.sheetSquareMeters < 0)
    simpleError("sheetSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const sheetCount = Math.ceil(
    (x.roofSquareMeters * (1 + x.wastePercent / 100)) / x.sheetSquareMeters,
  );
  if (!Number.isFinite(sheetCount) || !Number.isSafeInteger(sheetCount))
    simpleError(
      "sheetCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { sheetCount: Object.is(sheetCount, -0) ? 0 : sheetCount };
};

export const example = {
  input: { roofSquareMeters: 100, sheetSquareMeters: 3, wastePercent: 10 },
  output: { sheetCount: 37 },
} satisfies ToolExample<RoofSheathingSheetsInput, RoofSheathingSheetsOutput>;

export const tool = createSimpleTool({
  id: "construction/roof-sheathing-sheets",
  title: "Roof Sheathing Sheets",
  description:
    "Area-based minimum full roof-sheathing sheet count including a chosen waste allowance; layout may require additional sheets.",
  inputs: [
    {
      id: "roofSquareMeters",
      kind: "number",
      label: "Roof Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "sheetSquareMeters",
      kind: "number",
      label: "Sheet Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [{ id: "sheetCount", kind: "integer", label: "Sheet Count" }],
  calculate: (input) =>
    calculateRoofSheathingSheets({
      roofSquareMeters: input.roofSquareMeters as number,
      sheetSquareMeters: input.sheetSquareMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const roofSheathingSheetsTool = tool;
export const runRoofSheathingSheets = tool.execute;
export default tool;
