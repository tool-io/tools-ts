import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StringTensionForTargetPitchInput = Readonly<{
  readonly lengthMeters: number;
  readonly targetHertz: number;
  readonly linearDensityKgPerMeter: number;
}>;
export type StringTensionForTargetPitchOutput = Readonly<{
  readonly tensionNewtons: number;
}>;

export const calculateStringTensionForTargetPitch = (
  x: StringTensionForTargetPitchInput,
): StringTensionForTargetPitchOutput => {
  if (!Number.isFinite(x.lengthMeters) || x.lengthMeters <= 0)
    simpleError("lengthMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.targetHertz) || x.targetHertz <= 0)
    simpleError("targetHertz", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.linearDensityKgPerMeter) ||
    x.linearDensityKgPerMeter <= 0
  )
    simpleError("linearDensityKgPerMeter", "Provide a finite positive number.");
  const tensionNewtons =
    x.linearDensityKgPerMeter * (2 * x.lengthMeters * x.targetHertz) ** 2;
  if (!Number.isFinite(tensionNewtons))
    simpleError(
      "tensionNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { tensionNewtons: Object.is(tensionNewtons, -0) ? 0 : tensionNewtons };
};

export const example = {
  input: {
    lengthMeters: 1,
    targetHertz: 100,
    linearDensityKgPerMeter: 0.01,
  },
  output: { tensionNewtons: 400 },
} satisfies ToolExample<
  StringTensionForTargetPitchInput,
  StringTensionForTargetPitchOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/string-tension-for-target-pitch",
  title: "String Tension For Target Pitch",
  description:
    "Tension needed for an ideal stretched string to reach a target fundamental frequency.",
  inputs: [
    {
      id: "lengthMeters",
      kind: "number",
      label: "Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "targetHertz",
      kind: "number",
      label: "Target Hertz",
      unit: "Hz",
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
      id: "tensionNewtons",
      kind: "number",
      label: "Tension Newtons",
      unit: "N",
    },
  ],
  calculate: (input) =>
    calculateStringTensionForTargetPitch({
      lengthMeters: input.lengthMeters as number,
      targetHertz: input.targetHertz as number,
      linearDensityKgPerMeter: input.linearDensityKgPerMeter as number,
    }),
});
export const stringTensionForTargetPitchTool = tool;
export const runStringTensionForTargetPitch = tool.execute;
export default tool;
