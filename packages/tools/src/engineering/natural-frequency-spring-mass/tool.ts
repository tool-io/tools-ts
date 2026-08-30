import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NaturalFrequencySpringMassInput = Readonly<{
  readonly stiffnessNewtonsPerMeter: number;
  readonly massKilograms: number;
}>;
export type NaturalFrequencySpringMassOutput = Readonly<{
  readonly frequencyHertz: number;
}>;

export const calculateNaturalFrequencySpringMass = (
  x: NaturalFrequencySpringMassInput,
): NaturalFrequencySpringMassOutput => {
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
      "Inputs produce an undefined or out-of-range result.",
    );
  return { frequencyHertz: Object.is(frequencyHertz, -0) ? 0 : frequencyHertz };
};

export const example = {
  input: { stiffnessNewtonsPerMeter: 1000, massKilograms: 10 },
  output: { frequencyHertz: 1.5915494309189535 },
} satisfies ToolExample<
  NaturalFrequencySpringMassInput,
  NaturalFrequencySpringMassOutput
>;

export const tool = createSimpleTool({
  id: "engineering/natural-frequency-spring-mass",
  title: "Natural Frequency Spring Mass",
  description:
    "Undamped natural frequency of an ideal single-degree-of-freedom spring–mass system.",
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
    calculateNaturalFrequencySpringMass({
      stiffnessNewtonsPerMeter: input.stiffnessNewtonsPerMeter as number,
      massKilograms: input.massKilograms as number,
    }),
});
export const naturalFrequencySpringMassTool = tool;
export const runNaturalFrequencySpringMass = tool.execute;
export default tool;
