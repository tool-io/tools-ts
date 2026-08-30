import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FStopFromApertureInput = Readonly<{
  readonly focalLengthMillimeters: number;
  readonly entrancePupilMillimeters: number;
}>;
export type FStopFromApertureOutput = Readonly<{
  readonly fNumber: number;
}>;

export const calculateFStopFromAperture = (
  x: FStopFromApertureInput,
): FStopFromApertureOutput => {
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.entrancePupilMillimeters) ||
    x.entrancePupilMillimeters < 0
  )
    simpleError(
      "entrancePupilMillimeters",
      "Provide a finite number at least 0.",
    );
  const fNumber = x.focalLengthMillimeters / x.entrancePupilMillimeters;
  if (!Number.isFinite(fNumber))
    simpleError(
      "fNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { fNumber: Object.is(fNumber, -0) ? 0 : fNumber };
};

export const example = {
  input: { focalLengthMillimeters: 50, entrancePupilMillimeters: 25 },
  output: { fNumber: 2 },
} satisfies ToolExample<FStopFromApertureInput, FStopFromApertureOutput>;

export const tool = createSimpleTool({
  id: "film/f-stop-from-aperture",
  title: "F Stop From Aperture",
  description:
    "F-number from lens focal length divided by entrance-pupil diameter.",
  inputs: [
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "entrancePupilMillimeters",
      kind: "number",
      label: "Entrance Pupil Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "fNumber", kind: "number", label: "F Number" }],
  calculate: (input) =>
    calculateFStopFromAperture({
      focalLengthMillimeters: input.focalLengthMillimeters as number,
      entrancePupilMillimeters: input.entrancePupilMillimeters as number,
    }),
});
export const fStopFromApertureTool = tool;
export const runFStopFromAperture = tool.execute;
export default tool;
