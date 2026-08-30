import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GuitarFretDistanceMmFromScaleInput = Readonly<{
  readonly scaleLengthMillimeters: number;
  readonly fretNumber: number;
}>;
export type GuitarFretDistanceMmFromScaleOutput = Readonly<{
  readonly distanceFromNutMillimeters: number;
}>;

export const calculateGuitarFretDistanceMmFromScale = (
  x: GuitarFretDistanceMmFromScaleInput,
): GuitarFretDistanceMmFromScaleOutput => {
  if (
    !Number.isFinite(x.scaleLengthMillimeters) ||
    x.scaleLengthMillimeters <= 0
  )
    simpleError("scaleLengthMillimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.fretNumber) || x.fretNumber < 0)
    simpleError("fretNumber", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.fretNumber))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const distanceFromNutMillimeters =
    x.scaleLengthMillimeters * (1 - 2 ** (-x.fretNumber / 12));
  if (!Number.isFinite(distanceFromNutMillimeters))
    simpleError(
      "distanceFromNutMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    distanceFromNutMillimeters: Object.is(distanceFromNutMillimeters, -0)
      ? 0
      : distanceFromNutMillimeters,
  };
};

export const example = {
  input: {
    scaleLengthMillimeters: 648,
    fretNumber: 12,
  },
  output: { distanceFromNutMillimeters: 324 },
} satisfies ToolExample<
  GuitarFretDistanceMmFromScaleInput,
  GuitarFretDistanceMmFromScaleOutput
>;

export const tool = createSimpleTool({
  id: "music/guitar-fret-distance-mm-from-scale",
  title: "Guitar Fret Distance Mm From Scale",
  description:
    "Distance in millimetres from the nut to an equal-tempered fret on a string of given scale length.",
  inputs: [
    {
      id: "scaleLengthMillimeters",
      kind: "number",
      label: "Scale Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "fretNumber", kind: "number", label: "Fret Number", minimum: 0 },
  ],
  outputs: [
    {
      id: "distanceFromNutMillimeters",
      kind: "number",
      label: "Distance From Nut Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateGuitarFretDistanceMmFromScale({
      scaleLengthMillimeters: input.scaleLengthMillimeters as number,
      fretNumber: input.fretNumber as number,
    }),
});
export const guitarFretDistanceMmFromScaleTool = tool;
export const runGuitarFretDistanceMmFromScale = tool.execute;
export default tool;
