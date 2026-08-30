import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallSheetsInput = Readonly<{
  readonly netAreaSquareMeters: number;
  readonly sheetAreaSquareMeters: number;
  readonly wastePercent: number;
}>;
export type DrywallSheetsOutput = Readonly<{ sheetCount: number }>;

export const calculateDrywallSheets = (
  i: DrywallSheetsInput,
): DrywallSheetsOutput => {
  const value = Math.ceil(
    (i.netAreaSquareMeters * (1 + i.wastePercent / 100)) /
      i.sheetAreaSquareMeters,
  );
  if (!Number.isFinite(value))
    simpleError("sheetCount", "The inputs produce a non-finite result.");
  return { sheetCount: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    netAreaSquareMeters: 90,
    sheetAreaSquareMeters: 2.88,
    wastePercent: 10,
  },
  output: { sheetCount: 35 },
} satisfies ToolExample<DrywallSheetsInput, DrywallSheetsOutput>;

export const tool = createSimpleTool({
  id: "construction/drywall-sheets",
  title: "Drywall Sheets",
  description:
    "Round up drywall sheet count from net wall-and-ceiling area, sheet face area, and an additional waste percentage.",
  inputs: [
    {
      id: "netAreaSquareMeters",
      kind: "number",
      label: "Net Area (m²)",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "sheetAreaSquareMeters",
      kind: "number",
      label: "Sheet Area (m²)",
      unit: "m²",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Waste (%)",
      unit: "%",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [{ id: "sheetCount", kind: "integer", label: "Sheet Count" }],
  calculate: (input) =>
    calculateDrywallSheets({
      netAreaSquareMeters: input.netAreaSquareMeters as number,
      sheetAreaSquareMeters: input.sheetAreaSquareMeters as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const drywallSheetsTool = tool;
export const runDrywallSheets = tool.execute;
export default tool;
