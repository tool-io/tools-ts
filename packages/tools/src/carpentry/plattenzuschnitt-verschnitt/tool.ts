import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlattenzuschnittVerschnittInput = Readonly<{
  readonly stockSquareMeters: number;
  readonly usedSquareMeters: number;
}>;
export type PlattenzuschnittVerschnittOutput = Readonly<{
  readonly wastePercent: number;
}>;

export const calculatePlattenzuschnittVerschnitt = (
  x: PlattenzuschnittVerschnittInput,
): PlattenzuschnittVerschnittOutput => {
  if (!Number.isFinite(x.stockSquareMeters) || x.stockSquareMeters < 0)
    simpleError("stockSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.usedSquareMeters) || x.usedSquareMeters < 0)
    simpleError("usedSquareMeters", "Provide a finite number at least 0.");
  if (x.usedSquareMeters > x.stockSquareMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const wastePercent =
    (100 * (x.stockSquareMeters - x.usedSquareMeters)) / x.stockSquareMeters;
  if (!Number.isFinite(wastePercent))
    simpleError(
      "wastePercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return { wastePercent: Object.is(wastePercent, -0) ? 0 : wastePercent };
};

export const example = {
  input: { stockSquareMeters: 10, usedSquareMeters: 8 },
  output: { wastePercent: 20 },
} satisfies ToolExample<
  PlattenzuschnittVerschnittInput,
  PlattenzuschnittVerschnittOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/plattenzuschnitt-verschnitt",
  title: "Plattenzuschnitt Verschnitt",
  description:
    "Sheet-cutting waste percentage from used blank area and total stock-sheet area; excludes kerf unless supplied in used area.",
  inputs: [
    {
      id: "stockSquareMeters",
      kind: "number",
      label: "Stock Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "usedSquareMeters",
      kind: "number",
      label: "Used Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "wastePercent", kind: "number", label: "Waste Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculatePlattenzuschnittVerschnitt({
      stockSquareMeters: input.stockSquareMeters as number,
      usedSquareMeters: input.usedSquareMeters as number,
    }),
});
export const plattenzuschnittVerschnittTool = tool;
export const runPlattenzuschnittVerschnitt = tool.execute;
export default tool;
