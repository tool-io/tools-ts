import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AngularFrequencyCalculatorInput = Readonly<{
  readonly frequencyHertz: number;
}>;
export type AngularFrequencyCalculatorOutput = Readonly<{
  readonly radiansPerSecond: number;
}>;

export const calculateAngularFrequencyCalculator = (
  x: AngularFrequencyCalculatorInput,
): AngularFrequencyCalculatorOutput => {
  if (!Number.isFinite(x.frequencyHertz) || x.frequencyHertz < 0)
    simpleError("frequencyHertz", "Provide a finite nonnegative number.");
  const radiansPerSecond = 2 * Math.PI * x.frequencyHertz;
  if (!Number.isFinite(radiansPerSecond))
    simpleError(
      "radiansPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    radiansPerSecond: Object.is(radiansPerSecond, -0) ? 0 : radiansPerSecond,
  };
};

export const example = {
  input: {
    frequencyHertz: 1,
  },
  output: { radiansPerSecond: 6.283185307179586 },
} satisfies ToolExample<
  AngularFrequencyCalculatorInput,
  AngularFrequencyCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/angular-frequency-calculator",
  title: "Angular Frequency Calculator",
  description:
    "Angular frequency in radians per second from frequency in hertz.",
  inputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "radiansPerSecond",
      kind: "number",
      label: "Radians Per Second",
      unit: "rad/s",
    },
  ],
  calculate: (input) =>
    calculateAngularFrequencyCalculator({
      frequencyHertz: input.frequencyHertz as number,
    }),
});
export const angularFrequencyCalculatorTool = tool;
export const runAngularFrequencyCalculator = tool.execute;
export default tool;
