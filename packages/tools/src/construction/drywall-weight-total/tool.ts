import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DrywallWeightTotalInput = Readonly<{
  readonly sheetCount: number;
  readonly massPerSheetKg: number;
}>;
export type DrywallWeightTotalOutput = Readonly<{
  readonly totalMassKg: number;
}>;

export const calculateDrywallWeightTotal = (
  x: DrywallWeightTotalInput,
): DrywallWeightTotalOutput => {
  if (!Number.isSafeInteger(x.sheetCount) || x.sheetCount < 0)
    simpleError("sheetCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.massPerSheetKg) || x.massPerSheetKg < 0)
    simpleError("massPerSheetKg", "Provide a finite number at least 0.");
  const totalMassKg = x.sheetCount * x.massPerSheetKg;
  if (!Number.isFinite(totalMassKg))
    simpleError("totalMassKg", "The inputs produce an invalid result.");
  return { totalMassKg: Object.is(totalMassKg, -0) ? 0 : totalMassKg };
};

export const example = {
  input: { sheetCount: 12, massPerSheetKg: 24 },
  output: { totalMassKg: 288 },
} satisfies ToolExample<DrywallWeightTotalInput, DrywallWeightTotalOutput>;

export const tool = createSimpleTool({
  id: "construction/drywall-weight-total",
  title: "Total Drywall Weight",
  description:
    "Multiply the number of drywall sheets by the measured or specified mass of each sheet.",
  inputs: [
    { id: "sheetCount", kind: "integer", label: "Sheet count", minimum: 0 },
    {
      id: "massPerSheetKg",
      kind: "number",
      label: "Mass per sheet",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalMassKg",
      kind: "number",
      label: "Total drywall mass",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateDrywallWeightTotal({
      sheetCount: input.sheetCount as number,
      massPerSheetKg: input.massPerSheetKg as number,
    }),
});
export const drywallWeightTotalTool = tool;
export const runDrywallWeightTotal = tool.execute;
export default tool;
