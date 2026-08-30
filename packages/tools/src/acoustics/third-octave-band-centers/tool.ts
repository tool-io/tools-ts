import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThirdOctaveBandCentersInput = Readonly<{
  readonly referenceHertz: number;
  readonly bandOffset: number;
}>;
export type ThirdOctaveBandCentersOutput = Readonly<{
  readonly centerHertz: number;
}>;

export const calculateThirdOctaveBandCenters = (
  x: ThirdOctaveBandCentersInput,
): ThirdOctaveBandCentersOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz <= 0)
    simpleError("referenceHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.bandOffset))
    simpleError("bandOffset", "Provide a finite number.");
  if (!Number.isInteger(x.bandOffset))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerHertz = x.referenceHertz * 2 ** (x.bandOffset / 3);
  if (!Number.isFinite(centerHertz))
    simpleError(
      "centerHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { centerHertz: Object.is(centerHertz, -0) ? 0 : centerHertz };
};

export const example = {
  input: {
    referenceHertz: 1000,
    bandOffset: 3,
  },
  output: { centerHertz: 2000 },
} satisfies ToolExample<
  ThirdOctaveBandCentersInput,
  ThirdOctaveBandCentersOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/third-octave-band-centers",
  title: "Third Octave Band Centers",
  description:
    "Ideal third-octave-band center from a reference frequency and signed integer third-octave offset.",
  inputs: [
    {
      id: "referenceHertz",
      kind: "number",
      label: "Reference Hertz",
      unit: "Hz",
      minimum: 0,
    },
    { id: "bandOffset", kind: "number", label: "Band Offset" },
  ],
  outputs: [
    { id: "centerHertz", kind: "number", label: "Center Hertz", unit: "Hz" },
  ],
  calculate: (input) =>
    calculateThirdOctaveBandCenters({
      referenceHertz: input.referenceHertz as number,
      bandOffset: input.bandOffset as number,
    }),
});
export const thirdOctaveBandCentersTool = tool;
export const runThirdOctaveBandCenters = tool.execute;
export default tool;
