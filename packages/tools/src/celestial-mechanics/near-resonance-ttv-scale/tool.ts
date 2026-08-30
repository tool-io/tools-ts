import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly innerPeriodDays: number;
  readonly perturberStarMassRatio: number;
  readonly resonanceOffset: number;
  readonly modelCoefficient: number;
}>;
export type Output = Readonly<{
  readonly amplitudeDays: number;
  readonly amplitudeMinutes: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.innerPeriodDays, "innerPeriodDays");
  positive(input.perturberStarMassRatio, "perturberStarMassRatio");
  positive(input.modelCoefficient, "modelCoefficient");
  if (input.resonanceOffset === 0)
    simpleError(
      "resonanceOffset",
      "Offset cannot be zero in a nonresonant amplitude approximation.",
    );
  const amplitudeDays =
    (input.modelCoefficient *
      input.innerPeriodDays *
      input.perturberStarMassRatio) /
    (Math.PI * Math.abs(input.resonanceOffset));
  return { amplitudeDays, amplitudeMinutes: amplitudeDays * 1440 };
};
export const exampleInput = {
  innerPeriodDays: 10,
  perturberStarMassRatio: 1e-5,
  resonanceOffset: 0.01,
  modelCoefficient: 1,
} satisfies Input;
export const exampleOutput = {
  amplitudeDays: 0.003183098861837907,
  amplitudeMinutes: 4.583662361046586,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/near-resonance-ttv-scale",
  title: "Near Resonance Ttv Scale",
  description:
    "Evaluate a supplied near-resonance TTV scaling coefficient P·mass-ratio/(π·|Δ|); free eccentricity, exact resonance and mass inference are not modeled.",
  inputs: [
    { id: "innerPeriodDays", label: "Inner period days", kind: "number" },
    {
      id: "perturberStarMassRatio",
      label: "Perturber star mass ratio",
      kind: "number",
    },
    { id: "resonanceOffset", label: "Resonance offset", kind: "number" },
    { id: "modelCoefficient", label: "Model coefficient", kind: "number" },
  ],
  outputs: [
    { id: "amplitudeDays", label: "Amplitude days", kind: "number" },
    { id: "amplitudeMinutes", label: "Amplitude minutes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      innerPeriodDays: value.innerPeriodDays as number,
      perturberStarMassRatio: value.perturberStarMassRatio as number,
      resonanceOffset: value.resonanceOffset as number,
      modelCoefficient: value.modelCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
