import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VeneerSheetsNeededInput = Readonly<{
  readonly targetAreaM2: number;
  readonly wastePercent: number;
  readonly usableSheetAreaM2: number;
}>;
export type VeneerSheetsNeededOutput = Readonly<{
  readonly sheetCount: number;
}>;

export const calculateVeneerSheetsNeeded = (
  x: VeneerSheetsNeededInput,
): VeneerSheetsNeededOutput => {
  if (!Number.isFinite(x.targetAreaM2) || x.targetAreaM2 < 0)
    simpleError("targetAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.usableSheetAreaM2) || x.usableSheetAreaM2 < 0)
    simpleError("usableSheetAreaM2", "Provide a finite number at least 0.");
  if (!(x.usableSheetAreaM2 > 0))
    simpleError("usableSheetAreaM2", "Usable sheet area must be positive.");
  const sheetCount = Math.ceil(
    (x.targetAreaM2 * (1 + x.wastePercent / 100)) / x.usableSheetAreaM2,
  );
  if (!Number.isFinite(sheetCount) || !Number.isSafeInteger(sheetCount))
    simpleError("sheetCount", "The inputs produce an invalid result.");
  return { sheetCount: Object.is(sheetCount, -0) ? 0 : sheetCount };
};

export const example = {
  input: { targetAreaM2: 10, wastePercent: 10, usableSheetAreaM2: 2 },
  output: { sheetCount: 6 },
} satisfies ToolExample<VeneerSheetsNeededInput, VeneerSheetsNeededOutput>;

export const tool = createSimpleTool({
  id: "carpentry/veneer-sheets-needed",
  title: "Veneer Sheets Needed",
  description:
    "Round up full veneer sheets from target covered area, cut allowance, and usable sheet area after defects or edge margins.",
  inputs: [
    {
      id: "targetAreaM2",
      kind: "number",
      label: "Target veneer area",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Cut allowance",
      unit: "%",
      minimum: 0,
    },
    {
      id: "usableSheetAreaM2",
      kind: "number",
      label: "Usable area per sheet",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "sheetCount", kind: "integer", label: "Veneer sheets required" },
  ],
  calculate: (input) =>
    calculateVeneerSheetsNeeded({
      targetAreaM2: input.targetAreaM2 as number,
      wastePercent: input.wastePercent as number,
      usableSheetAreaM2: input.usableSheetAreaM2 as number,
    }),
});
export const veneerSheetsNeededTool = tool;
export const runVeneerSheetsNeeded = tool.execute;
export default tool;
