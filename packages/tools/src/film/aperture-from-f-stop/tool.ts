import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApertureFromFStopInput = Readonly<{
  readonly focalLengthMillimeters: number;
  readonly fNumber: number;
}>;
export type ApertureFromFStopOutput = Readonly<{
  readonly entrancePupilMillimeters: number;
}>;

export const calculateApertureFromFStop = (
  x: ApertureFromFStopInput,
): ApertureFromFStopOutput => {
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.fNumber) || x.fNumber < 0)
    simpleError("fNumber", "Provide a finite number at least 0.");
  const entrancePupilMillimeters = x.focalLengthMillimeters / x.fNumber;
  if (!Number.isFinite(entrancePupilMillimeters))
    simpleError(
      "entrancePupilMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    entrancePupilMillimeters: Object.is(entrancePupilMillimeters, -0)
      ? 0
      : entrancePupilMillimeters,
  };
};

export const example = {
  input: { focalLengthMillimeters: 50, fNumber: 2 },
  output: { entrancePupilMillimeters: 25 },
} satisfies ToolExample<ApertureFromFStopInput, ApertureFromFStopOutput>;

export const tool = createSimpleTool({
  id: "film/aperture-from-f-stop",
  title: "Aperture From F Stop",
  description:
    "Entrance-pupil diameter from focal length divided by f-number; not the physical diaphragm diameter.",
  inputs: [
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "fNumber", kind: "number", label: "F Number", minimum: 0 },
  ],
  outputs: [
    {
      id: "entrancePupilMillimeters",
      kind: "number",
      label: "Entrance Pupil Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateApertureFromFStop({
      focalLengthMillimeters: input.focalLengthMillimeters as number,
      fNumber: input.fNumber as number,
    }),
});
export const apertureFromFStopTool = tool;
export const runApertureFromFStop = tool.execute;
export default tool;
