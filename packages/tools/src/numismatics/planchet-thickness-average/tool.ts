import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlanchetThicknessAverageInput = Readonly<{
  readonly firstThicknessMillimeters: number;
  readonly secondThicknessMillimeters: number;
  readonly thirdThicknessMillimeters: number;
}>;
export type PlanchetThicknessAverageOutput = Readonly<{
  readonly averageThicknessMillimeters: number;
}>;

export const calculatePlanchetThicknessAverage = (
  x: PlanchetThicknessAverageInput,
): PlanchetThicknessAverageOutput => {
  if (
    !Number.isFinite(x.firstThicknessMillimeters) ||
    x.firstThicknessMillimeters < 0
  )
    simpleError(
      "firstThicknessMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.secondThicknessMillimeters) ||
    x.secondThicknessMillimeters < 0
  )
    simpleError(
      "secondThicknessMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.thirdThicknessMillimeters) ||
    x.thirdThicknessMillimeters < 0
  )
    simpleError(
      "thirdThicknessMillimeters",
      "Provide a finite nonnegative number.",
    );
  const averageThicknessMillimeters =
    (x.firstThicknessMillimeters +
      x.secondThicknessMillimeters +
      x.thirdThicknessMillimeters) /
    3;
  if (!Number.isFinite(averageThicknessMillimeters))
    simpleError(
      "averageThicknessMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageThicknessMillimeters: Object.is(averageThicknessMillimeters, -0)
      ? 0
      : averageThicknessMillimeters,
  };
};

export const example = {
  input: {
    firstThicknessMillimeters: 2,
    secondThicknessMillimeters: 2.1,
    thirdThicknessMillimeters: 1.9,
  },
  output: { averageThicknessMillimeters: 2 },
} satisfies ToolExample<
  PlanchetThicknessAverageInput,
  PlanchetThicknessAverageOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/planchet-thickness-average",
  title: "Planchet Thickness Average",
  description:
    "Average three caliper measurements around a planchet; local rim or relief features can distort readings.",
  inputs: [
    {
      id: "firstThicknessMillimeters",
      kind: "number",
      label: "First Thickness Millimeters",
      unit: "mm",
    },
    {
      id: "secondThicknessMillimeters",
      kind: "number",
      label: "Second Thickness Millimeters",
      unit: "mm",
    },
    {
      id: "thirdThicknessMillimeters",
      kind: "number",
      label: "Third Thickness Millimeters",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "averageThicknessMillimeters",
      kind: "number",
      label: "Average Thickness Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculatePlanchetThicknessAverage({
      firstThicknessMillimeters: input.firstThicknessMillimeters as number,
      secondThicknessMillimeters: input.secondThicknessMillimeters as number,
      thirdThicknessMillimeters: input.thirdThicknessMillimeters as number,
    }),
});
export const runPlanchetThicknessAverage = tool.execute;
export default tool;
