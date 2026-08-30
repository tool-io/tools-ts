import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CircleOfConfusionInput = Readonly<{
  readonly sensorDiagonalMillimeters: number;
  readonly viewingDivisor: number;
}>;
export type CircleOfConfusionOutput = Readonly<{
  readonly circleOfConfusionMillimeters: number;
}>;

export const calculateCircleOfConfusion = (
  x: CircleOfConfusionInput,
): CircleOfConfusionOutput => {
  if (
    !Number.isFinite(x.sensorDiagonalMillimeters) ||
    x.sensorDiagonalMillimeters < 0
  )
    simpleError(
      "sensorDiagonalMillimeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.viewingDivisor) || x.viewingDivisor < 0)
    simpleError("viewingDivisor", "Provide a finite number at least 0.");
  const circleOfConfusionMillimeters =
    x.sensorDiagonalMillimeters / x.viewingDivisor;
  if (!Number.isFinite(circleOfConfusionMillimeters))
    simpleError(
      "circleOfConfusionMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    circleOfConfusionMillimeters: Object.is(circleOfConfusionMillimeters, -0)
      ? 0
      : circleOfConfusionMillimeters,
  };
};

export const example = {
  input: { sensorDiagonalMillimeters: 43.27, viewingDivisor: 1500 },
  output: { circleOfConfusionMillimeters: 0.02884666666666667 },
} satisfies ToolExample<CircleOfConfusionInput, CircleOfConfusionOutput>;

export const tool = createSimpleTool({
  id: "film/circle-of-confusion",
  title: "Circle Of Confusion",
  description:
    "Conventional permissible circle-of-confusion diameter from sensor diagonal divided by a user-selected viewing divisor; not an optical constant.",
  inputs: [
    {
      id: "sensorDiagonalMillimeters",
      kind: "number",
      label: "Sensor Diagonal Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "viewingDivisor",
      kind: "number",
      label: "Viewing Divisor",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "circleOfConfusionMillimeters",
      kind: "number",
      label: "Circle Of Confusion Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateCircleOfConfusion({
      sensorDiagonalMillimeters: input.sensorDiagonalMillimeters as number,
      viewingDivisor: input.viewingDivisor as number,
    }),
});
export const circleOfConfusionTool = tool;
export const runCircleOfConfusion = tool.execute;
export default tool;
