import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HapticResonantFrequencyInput = Readonly<{
  readonly stiffnessNewtonsPerMeter: number;
  readonly massKilograms: number;
}>;
export type HapticResonantFrequencyOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateHapticResonantFrequency = (
  x: HapticResonantFrequencyInput,
): HapticResonantFrequencyOutput => {
  if (
    !Number.isFinite(x.stiffnessNewtonsPerMeter) ||
    x.stiffnessNewtonsPerMeter < 0
  )
    simpleError(
      "stiffnessNewtonsPerMeter",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.massKilograms) || x.massKilograms < 0)
    simpleError("massKilograms", "Provide a finite number at least 0.");
  const frequencyHertz =
    Math.sqrt(x.stiffnessNewtonsPerMeter / x.massKilograms) / (2 * Math.PI);
  if (!Number.isFinite(frequencyHertz))
    simpleError(
      "frequencyHertz",
      "Inputs produce an undefined or non-finite result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: { stiffnessNewtonsPerMeter: 1000, massKilograms: 0.01 },
  output: { frequencyHertz: 50.32921210448704 },
} satisfies ToolExample<
  HapticResonantFrequencyInput,
  HapticResonantFrequencyOutput
>;

export const tool = createSimpleTool({
  id: "electronics/haptic-resonant-frequency",
  title: "Haptic Resonant Frequency",
  description:
    "Undamped natural frequency of a single-degree-of-freedom haptic actuator from effective stiffness and moving mass.",
  inputs: [
    {
      id: "stiffnessNewtonsPerMeter",
      kind: "number",
      label: "Stiffness Newtons Per Meter",
      unit: "N/m",
      minimum: 0,
    },
    {
      id: "massKilograms",
      kind: "number",
      label: "Mass Kilograms",
      unit: "kg",
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
    calculateHapticResonantFrequency({
      stiffnessNewtonsPerMeter: input.stiffnessNewtonsPerMeter as number,
      massKilograms: input.massKilograms as number,
    }),
});
export const hapticResonantFrequencyTool = tool;
export const runHapticResonantFrequency = tool.execute;
export default tool;
