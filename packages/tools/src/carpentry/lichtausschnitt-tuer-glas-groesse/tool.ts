import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LichtausschnittTuerGlasGroesseInput = Readonly<{
  readonly openingWidthMm: number;
  readonly openingHeightMm: number;
  readonly clearanceMm: number;
}>;
export type LichtausschnittTuerGlasGroesseOutput = Readonly<{
  readonly glassWidthMm: number;
  readonly glassHeightMm: number;
}>;

export const calculateLichtausschnittTuerGlasGroesse = (
  x: LichtausschnittTuerGlasGroesseInput,
): LichtausschnittTuerGlasGroesseOutput => {
  if (!Number.isFinite(x.openingWidthMm) || x.openingWidthMm < 0)
    simpleError("openingWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.openingHeightMm) || x.openingHeightMm < 0)
    simpleError("openingHeightMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.clearanceMm) || x.clearanceMm < 0)
    simpleError("clearanceMm", "Provide a finite number at least 0.");
  if (2 * x.clearanceMm >= Math.min(x.openingWidthMm, x.openingHeightMm))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const glassWidthMm = x.openingWidthMm - 2 * x.clearanceMm;
  if (!Number.isFinite(glassWidthMm))
    simpleError(
      "glassWidthMm",
      "Inputs produce an undefined or out-of-range result.",
    );
  const glassHeightMm = x.openingHeightMm - 2 * x.clearanceMm;
  if (!Number.isFinite(glassHeightMm))
    simpleError(
      "glassHeightMm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    glassWidthMm: Object.is(glassWidthMm, -0) ? 0 : glassWidthMm,
    glassHeightMm: Object.is(glassHeightMm, -0) ? 0 : glassHeightMm,
  };
};

export const example = {
  input: { openingWidthMm: 500, openingHeightMm: 800, clearanceMm: 3 },
  output: { glassWidthMm: 494, glassHeightMm: 794 },
} satisfies ToolExample<
  LichtausschnittTuerGlasGroesseInput,
  LichtausschnittTuerGlasGroesseOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/lichtausschnitt-tuer-glas-groesse",
  title: "Lichtausschnitt Tuer Glas Groesse",
  description:
    "Calculate rectangular glass cut size from a measured door opening and equal edge clearance on all sides; glazing bite is not included.",
  inputs: [
    {
      id: "openingWidthMm",
      kind: "number",
      label: "Opening Width Mm",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "openingHeightMm",
      kind: "number",
      label: "Opening Height Mm",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "clearanceMm",
      kind: "number",
      label: "Clearance Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "glassWidthMm", kind: "number", label: "Glass Width Mm", unit: "mm" },
    {
      id: "glassHeightMm",
      kind: "number",
      label: "Glass Height Mm",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateLichtausschnittTuerGlasGroesse({
      openingWidthMm: input.openingWidthMm as number,
      openingHeightMm: input.openingHeightMm as number,
      clearanceMm: input.clearanceMm as number,
    }),
});
export const lichtausschnittTuerGlasGroesseTool = tool;
export const runLichtausschnittTuerGlasGroesse = tool.execute;
export default tool;
