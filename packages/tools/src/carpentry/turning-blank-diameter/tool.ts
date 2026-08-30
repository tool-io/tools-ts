import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TurningBlankDiameterInput = Readonly<{
  readonly blankWidthMm: number;
  readonly blankThicknessMm: number;
}>;
export type TurningBlankDiameterOutput = Readonly<{
  readonly maximumRoundDiameterMm: number;
}>;

export const calculateTurningBlankDiameter = (
  x: TurningBlankDiameterInput,
): TurningBlankDiameterOutput => {
  if (!Number.isFinite(x.blankWidthMm) || x.blankWidthMm < 0)
    simpleError("blankWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.blankThicknessMm) || x.blankThicknessMm < 0)
    simpleError("blankThicknessMm", "Provide a finite number at least 0.");
  const maximumRoundDiameterMm = Math.min(x.blankWidthMm, x.blankThicknessMm);
  if (!Number.isFinite(maximumRoundDiameterMm))
    simpleError(
      "maximumRoundDiameterMm",
      "The inputs produce an invalid result.",
    );
  return {
    maximumRoundDiameterMm: Object.is(maximumRoundDiameterMm, -0)
      ? 0
      : maximumRoundDiameterMm,
  };
};

export const example = {
  input: { blankWidthMm: 60, blankThicknessMm: 80 },
  output: { maximumRoundDiameterMm: 60 },
} satisfies ToolExample<TurningBlankDiameterInput, TurningBlankDiameterOutput>;

export const tool = createSimpleTool({
  id: "carpentry/turning-blank-diameter",
  title: "Turning Blank Diameter",
  description:
    "Find the largest full-length round diameter that can be turned from rectangular stock without adding material.",
  inputs: [
    {
      id: "blankWidthMm",
      kind: "number",
      label: "Rectangular blank width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "blankThicknessMm",
      kind: "number",
      label: "Rectangular blank thickness",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maximumRoundDiameterMm",
      kind: "number",
      label: "Maximum full-length round diameter",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTurningBlankDiameter({
      blankWidthMm: input.blankWidthMm as number,
      blankThicknessMm: input.blankThicknessMm as number,
    }),
});
export const turningBlankDiameterTool = tool;
export const runTurningBlankDiameter = tool.execute;
export default tool;
