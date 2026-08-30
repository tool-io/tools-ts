import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FresnelNumberBarrierInput = Readonly<{
  readonly pathDifferenceMeters: number;
  readonly wavelengthMeters: number;
}>;
export type FresnelNumberBarrierOutput = Readonly<{
  readonly fresnelNumber: number;
}>;

export const calculateFresnelNumberBarrier = (
  x: FresnelNumberBarrierInput,
): FresnelNumberBarrierOutput => {
  if (!Number.isFinite(x.pathDifferenceMeters) || x.pathDifferenceMeters < 0)
    simpleError("pathDifferenceMeters", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.wavelengthMeters) || x.wavelengthMeters <= 0)
    simpleError("wavelengthMeters", "Provide a finite positive number.");
  const fresnelNumber = (2 * x.pathDifferenceMeters) / x.wavelengthMeters;
  if (!Number.isFinite(fresnelNumber))
    simpleError(
      "fresnelNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { fresnelNumber: Object.is(fresnelNumber, -0) ? 0 : fresnelNumber };
};

export const example = {
  input: {
    pathDifferenceMeters: 0.5,
    wavelengthMeters: 1,
  },
  output: { fresnelNumber: 1 },
} satisfies ToolExample<FresnelNumberBarrierInput, FresnelNumberBarrierOutput>;

export const tool = createSimpleTool({
  id: "acoustics/fresnel-number-barrier",
  title: "Fresnel Number Barrier",
  description:
    "Barrier Fresnel number 2δ/λ from extra sound-path length and wavelength.",
  inputs: [
    {
      id: "pathDifferenceMeters",
      kind: "number",
      label: "Path Difference Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "fresnelNumber", kind: "number", label: "Fresnel Number" }],
  calculate: (input) =>
    calculateFresnelNumberBarrier({
      pathDifferenceMeters: input.pathDifferenceMeters as number,
      wavelengthMeters: input.wavelengthMeters as number,
    }),
});
export const fresnelNumberBarrierTool = tool;
export const runFresnelNumberBarrier = tool.execute;
export default tool;
