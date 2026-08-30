import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuszugsschienenLaengeInput = Readonly<{
  readonly insideDepthMillimeters: number;
  readonly rearClearanceMillimeters: number;
}>;
export type AuszugsschienenLaengeOutput = Readonly<{
  readonly maximumSlideMillimeters: number;
}>;

export const calculateAuszugsschienenLaenge = (
  x: AuszugsschienenLaengeInput,
): AuszugsschienenLaengeOutput => {
  if (
    !Number.isFinite(x.insideDepthMillimeters) ||
    x.insideDepthMillimeters < 0
  )
    simpleError(
      "insideDepthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.rearClearanceMillimeters) ||
    x.rearClearanceMillimeters < 0
  )
    simpleError(
      "rearClearanceMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.rearClearanceMillimeters >= x.insideDepthMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const maximumSlideMillimeters =
    x.insideDepthMillimeters - x.rearClearanceMillimeters;
  if (!Number.isFinite(maximumSlideMillimeters))
    simpleError(
      "maximumSlideMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    maximumSlideMillimeters: Object.is(maximumSlideMillimeters, -0)
      ? 0
      : maximumSlideMillimeters,
  };
};

export const example = {
  input: { insideDepthMillimeters: 500, rearClearanceMillimeters: 20 },
  output: { maximumSlideMillimeters: 480 },
} satisfies ToolExample<
  AuszugsschienenLaengeInput,
  AuszugsschienenLaengeOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/auszugsschienen-laenge",
  title: "Auszugsschienen Laenge",
  description:
    "Longest drawer-slide length that fits a measured cabinet interior depth after reserving a specified rear clearance; choose an available product size no longer than this result.",
  inputs: [
    {
      id: "insideDepthMillimeters",
      kind: "number",
      label: "Inside Depth Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "rearClearanceMillimeters",
      kind: "number",
      label: "Rear Clearance Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "maximumSlideMillimeters",
      kind: "number",
      label: "Maximum Slide Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateAuszugsschienenLaenge({
      insideDepthMillimeters: input.insideDepthMillimeters as number,
      rearClearanceMillimeters: input.rearClearanceMillimeters as number,
    }),
});
export const auszugsschienenLaengeTool = tool;
export const runAuszugsschienenLaenge = tool.execute;
export default tool;
