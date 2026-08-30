import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GuideNumberApertureInput = Readonly<{
  readonly guideNumberMeters: number;
  readonly distanceMeters: number;
}>;
export type GuideNumberApertureOutput = Readonly<{
  readonly fNumber: number;
}>;

export const calculateGuideNumberAperture = (
  x: GuideNumberApertureInput,
): GuideNumberApertureOutput => {
  if (!Number.isFinite(x.guideNumberMeters) || x.guideNumberMeters < 0)
    simpleError("guideNumberMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.distanceMeters) || x.distanceMeters < 0)
    simpleError("distanceMeters", "Provide a finite number at least 0.");
  const fNumber = x.guideNumberMeters / x.distanceMeters;
  if (!Number.isFinite(fNumber))
    simpleError(
      "fNumber",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { fNumber: Object.is(fNumber, -0) ? 0 : fNumber };
};

export const example = {
  input: { guideNumberMeters: 32, distanceMeters: 4 },
  output: { fNumber: 8 },
} satisfies ToolExample<GuideNumberApertureInput, GuideNumberApertureOutput>;

export const tool = createSimpleTool({
  id: "film/guide-number-aperture",
  title: "Guide Number Aperture",
  description:
    "Flash f-number from guide number divided by flash-to-subject distance, at the guide number's ISO and flash setting.",
  inputs: [
    {
      id: "guideNumberMeters",
      kind: "number",
      label: "Guide Number Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "fNumber", kind: "number", label: "F Number" }],
  calculate: (input) =>
    calculateGuideNumberAperture({
      guideNumberMeters: input.guideNumberMeters as number,
      distanceMeters: input.distanceMeters as number,
    }),
});
export const guideNumberApertureTool = tool;
export const runGuideNumberAperture = tool.execute;
export default tool;
