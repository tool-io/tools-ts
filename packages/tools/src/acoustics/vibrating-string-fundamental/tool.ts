import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VibratingStringFundamentalInput = Readonly<{
  readonly lengthMeters: number;
  readonly tensionNewtons: number;
  readonly linearDensityKgPerMeter: number;
}>;
export type VibratingStringFundamentalOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateVibratingStringFundamental = (
  x: VibratingStringFundamentalInput,
): VibratingStringFundamentalOutput => {
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters <= 0)
    simpleError("lengthMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.tensionNewtons) || x.tensionNewtons <= 0)
    simpleError("tensionNewtons", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.linearDensityKgPerMeter) ||
    x.linearDensityKgPerMeter <= 0
  )
    simpleError("linearDensityKgPerMeter", "Provide a finite positive number.");
  const frequencyHertz =
    Math.sqrt(x.tensionNewtons / x.linearDensityKgPerMeter) /
    (2 * x.lengthMeters);
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: {
    lengthMeters: 1,
    tensionNewtons: 100,
    linearDensityKgPerMeter: 0.01,
  },
  output: { frequencyHertz: 50 },
} satisfies ToolExample<
  VibratingStringFundamentalInput,
  VibratingStringFundamentalOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/vibrating-string-fundamental",
  title: "Vibrating String Fundamental",
  description:
    "Ideal stretched-string fundamental frequency from length, tension, and mass per unit length.",
  inputs: [
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "tensionNewtons",
      kind: "number",
      label: "Tension Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "linearDensityKgPerMeter",
      kind: "number",
      label: "Linear Density Kg Per Meter",
      unit: "kg/m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "frequencyHertz",
      kind: "number",
      label: "Frequency Hertz",
      unit: "Hz",
    },
  ],
  calculate: (input) =>
    calculateVibratingStringFundamental({
      lengthMeters: input.lengthMeters as number,
      tensionNewtons: input.tensionNewtons as number,
      linearDensityKgPerMeter: input.linearDensityKgPerMeter as number,
    }),
});
export const vibratingStringFundamentalTool = tool;
export const runVibratingStringFundamental = tool.execute;
export default tool;
