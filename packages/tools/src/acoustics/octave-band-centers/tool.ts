import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OctaveBandCentersInput = Readonly<{
  readonly referenceHertz: number;
  readonly bandOffset: number;
}>;
export type OctaveBandCentersOutput = Readonly<{
  readonly centerHertz: number;
}>;

export const calculateOctaveBandCenters = (
  x: OctaveBandCentersInput,
): OctaveBandCentersOutput => {
  if (!Number.isFinite(x.referenceHertz) || x.referenceHertz <= 0)
    simpleError("referenceHertz", "Provide a finite positive number.");
  if (!Number.isFinite(x.bandOffset))
    simpleError("bandOffset", "Provide a finite number.");
  if (!Number.isInteger(x.bandOffset))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerHertz = x.referenceHertz * 2 ** x.bandOffset;
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
    bandOffset: 1,
  },
  output: { centerHertz: 2000 },
} satisfies ToolExample<OctaveBandCentersInput, OctaveBandCentersOutput>;

export const tool = createSimpleTool({
  id: "acoustics/octave-band-centers",
  title: "Octave Band Centers",
  description:
    "Ideal octave-band center frequency relative to a reference frequency and signed integer band offset.",
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
    calculateOctaveBandCenters({
      referenceHertz: input.referenceHertz as number,
      bandOffset: input.bandOffset as number,
    }),
});
export const octaveBandCentersTool = tool;
export const runOctaveBandCenters = tool.execute;
export default tool;
