import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DayShapeVisibilityRangeInput = {
  readonly recognitionAngleArcmin?: number;
  readonly shapeSizeMeters: number;
};

export type DayShapeVisibilityRangeOutput = {
  readonly visibilityRangeNm: number;
};

export const dayShapeVisibilityRangeExample = {
  input: { recognitionAngleArcmin: 5, shapeSizeMeters: 2 },
  output: { visibilityRangeNm: 0.7424933794203438 },
} satisfies ToolExample<
  DayShapeVisibilityRangeInput,
  DayShapeVisibilityRangeOutput
>;

export const calculateDayShapeVisibilityRange = (
  input: DayShapeVisibilityRangeInput,
): DayShapeVisibilityRangeOutput => {
  if (input.shapeSizeMeters <= 0)
    simpleError(
      "shapeSizeMeters",
      "Day shape size must be positive.",
      "invalid_input",
    );
  const recognitionAngleArcmin = input.recognitionAngleArcmin ?? 5;
  if (recognitionAngleArcmin <= 0)
    simpleError(
      "recognitionAngleArcmin",
      "The recognition angle must be positive.",
      "invalid_input",
    );
  return {
    visibilityRangeNm:
      input.shapeSizeMeters /
      Math.tan((recognitionAngleArcmin * Math.PI) / (180 * 60)) /
      1852,
  };
};

export const dayShapeVisibilityRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateDayShapeVisibilityRange(
      input as unknown as DayShapeVisibilityRangeInput,
    ),
  description:
    "Calculate the distance at which a day shape subtends a chosen recognition angle. Weather, contrast, eyesight, and obstructions can reduce actual recognition range.",
  id: "sailing/day-shape-visibility-range",
  inputs: [
    {
      default: 5,
      description:
        "Angular size required to recognize the shape, rather than merely detect a point.",
      id: "recognitionAngleArcmin",
      kind: "number",
      label: "Recognition angle",
      minimum: 0,
      unit: "arcmin",
    },
    {
      description:
        "Linear size of the day shape such as the diameter of a ball or side of a diamond.",
      format: "length-m",
      id: "shapeSizeMeters",
      kind: "number",
      label: "Shape size",
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Approximate range at which the day shape can be recognised.",
      format: "length-nm",
      id: "visibilityRangeNm",
      kind: "number",
      label: "Visibility range",
      unit: "NM",
    },
  ],
  title: "Day Shape Visibility Range",
});
export const runDayShapeVisibilityRange = dayShapeVisibilityRangeTool.execute;
export default dayShapeVisibilityRangeTool;
