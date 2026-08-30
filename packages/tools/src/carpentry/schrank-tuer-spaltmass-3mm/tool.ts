import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchrankTuerSpaltmass3mmInput = Readonly<{
  readonly measuredGapMm: number;
}>;
export type SchrankTuerSpaltmass3mmOutput = Readonly<{
  readonly differenceFrom3Mm: number;
}>;

export const calculateSchrankTuerSpaltmass3mm = (
  x: SchrankTuerSpaltmass3mmInput,
): SchrankTuerSpaltmass3mmOutput => {
  if (!Number.isFinite(x.measuredGapMm) || x.measuredGapMm < 0)
    simpleError("measuredGapMm", "Provide a finite number at least 0.");
  const differenceFrom3Mm = x.measuredGapMm - 3;
  if (!Number.isFinite(differenceFrom3Mm))
    simpleError(
      "differenceFrom3Mm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    differenceFrom3Mm: Object.is(differenceFrom3Mm, -0) ? 0 : differenceFrom3Mm,
  };
};

export const example = {
  input: { measuredGapMm: 4 },
  output: { differenceFrom3Mm: 1 },
} satisfies ToolExample<
  SchrankTuerSpaltmass3mmInput,
  SchrankTuerSpaltmass3mmOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/schrank-tuer-spaltmass-3mm",
  title: "Schrank Tuer Spaltmass 3mm",
  description:
    "Difference between a measured cabinet-door reveal and a 3 mm target; positive values mean the actual gap is wider.",
  inputs: [
    {
      id: "measuredGapMm",
      kind: "number",
      label: "Measured Gap Mm",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "differenceFrom3Mm",
      kind: "number",
      label: "Difference From3 Mm",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateSchrankTuerSpaltmass3mm({
      measuredGapMm: input.measuredGapMm as number,
    }),
});
export const schrankTuerSpaltmass3mmTool = tool;
export const runSchrankTuerSpaltmass3mm = tool.execute;
export default tool;
