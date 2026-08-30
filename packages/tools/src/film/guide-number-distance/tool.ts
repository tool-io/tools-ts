import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GuideNumberDistanceInput = Readonly<{
  readonly guideNumberMeters: number;
  readonly fNumber: number;
}>;
export type GuideNumberDistanceOutput = Readonly<{
  readonly distanceMeters: number;
}>;

export const calculateGuideNumberDistance = (
  x: GuideNumberDistanceInput,
): GuideNumberDistanceOutput => {
  if (!Number.isFinite(x.guideNumberMeters) || x.guideNumberMeters < 0)
    simpleError("guideNumberMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fNumber) || x.fNumber < 0)
    simpleError("fNumber", "Provide a finite number at least 0.");
  const distanceMeters = x.guideNumberMeters / x.fNumber;
  if (!Number.isFinite(distanceMeters))
    simpleError(
      "distanceMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { distanceMeters: Object.is(distanceMeters, -0) ? 0 : distanceMeters };
};

export const example = {
  input: { guideNumberMeters: 32, fNumber: 8 },
  output: { distanceMeters: 4 },
} satisfies ToolExample<GuideNumberDistanceInput, GuideNumberDistanceOutput>;

export const tool = createSimpleTool({
  id: "film/guide-number-distance",
  title: "Guide Number Distance",
  description:
    "Maximum flash-to-subject distance from guide number divided by f-number, at the guide number's ISO and flash setting.",
  inputs: [
    {
      id: "guideNumberMeters",
      kind: "number",
      label: "Guide Number Meters",
      unit: "m",
      minimum: 0,
    },
    { id: "fNumber", kind: "number", label: "F Number", minimum: 0 },
  ],
  outputs: [
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateGuideNumberDistance({
      guideNumberMeters: input.guideNumberMeters as number,
      fNumber: input.fNumber as number,
    }),
});
export const guideNumberDistanceTool = tool;
export const runGuideNumberDistance = tool.execute;
export default tool;
