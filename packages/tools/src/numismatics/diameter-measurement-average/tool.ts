import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiameterMeasurementAverageInput = Readonly<{
  readonly firstDiameterMillimeters: number;
  readonly secondDiameterMillimeters: number;
  readonly thirdDiameterMillimeters: number;
}>;
export type DiameterMeasurementAverageOutput = Readonly<{
  readonly averageDiameterMillimeters: number;
}>;

export const calculateDiameterMeasurementAverage = (
  x: DiameterMeasurementAverageInput,
): DiameterMeasurementAverageOutput => {
  if (
    !Number.isFinite(x.firstDiameterMillimeters) ||
    x.firstDiameterMillimeters < 0
  )
    simpleError(
      "firstDiameterMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.secondDiameterMillimeters) ||
    x.secondDiameterMillimeters < 0
  )
    simpleError(
      "secondDiameterMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.thirdDiameterMillimeters) ||
    x.thirdDiameterMillimeters < 0
  )
    simpleError(
      "thirdDiameterMillimeters",
      "Provide a finite nonnegative number.",
    );
  const averageDiameterMillimeters =
    (x.firstDiameterMillimeters +
      x.secondDiameterMillimeters +
      x.thirdDiameterMillimeters) /
    3;
  if (!Number.isFinite(averageDiameterMillimeters))
    simpleError(
      "averageDiameterMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    averageDiameterMillimeters: Object.is(averageDiameterMillimeters, -0)
      ? 0
      : averageDiameterMillimeters,
  };
};

export const example = {
  input: {
    firstDiameterMillimeters: 20,
    secondDiameterMillimeters: 20.1,
    thirdDiameterMillimeters: 19.9,
  },
  output: { averageDiameterMillimeters: 20 },
} satisfies ToolExample<
  DiameterMeasurementAverageInput,
  DiameterMeasurementAverageOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/diameter-measurement-average",
  title: "Diameter Measurement Average",
  description: "Average three diameter measurements at different orientations.",
  inputs: [
    {
      id: "firstDiameterMillimeters",
      kind: "number",
      label: "First Diameter Millimeters",
      unit: "mm",
    },
    {
      id: "secondDiameterMillimeters",
      kind: "number",
      label: "Second Diameter Millimeters",
      unit: "mm",
    },
    {
      id: "thirdDiameterMillimeters",
      kind: "number",
      label: "Third Diameter Millimeters",
      unit: "mm",
    },
  ],
  outputs: [
    {
      id: "averageDiameterMillimeters",
      kind: "number",
      label: "Average Diameter Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDiameterMeasurementAverage({
      firstDiameterMillimeters: input.firstDiameterMillimeters as number,
      secondDiameterMillimeters: input.secondDiameterMillimeters as number,
      thirdDiameterMillimeters: input.thirdDiameterMillimeters as number,
    }),
});
export const runDiameterMeasurementAverage = tool.execute;
export default tool;
