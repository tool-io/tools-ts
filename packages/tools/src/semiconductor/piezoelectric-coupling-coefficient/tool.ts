import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedResonanceHz: number;
  readonly observedAntiresonanceHz: number;
}>;
export type Output = Readonly<{
  readonly modeledEffectivePiezoCouplingSquared: number;
  readonly modeledEffectivePiezoCoupling: number;
}>;
const inputFields = [
  { id: "observedResonanceHz", label: "Observed resonance hz", kind: "number" },
  {
    id: "observedAntiresonanceHz",
    label: "Observed antiresonance hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedResonanceHz, "observedResonanceHz");
  positive(input.observedAntiresonanceHz, "observedAntiresonanceHz");
  if (input.observedAntiresonanceHz < input.observedResonanceHz)
    simpleError(
      "resonance",
      "Ordered independently matched resonance/antiresonance required.",
    );
  const squared =
    1 - (input.observedResonanceHz / input.observedAntiresonanceHz) ** 2;
  return {
    modeledEffectivePiezoCouplingSquared: squared,
    modeledEffectivePiezoCoupling: Math.sqrt(squared),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedResonanceHz: 9,
  observedAntiresonanceHz: 10,
} satisfies Input;
export const exampleOutput = {
  modeledEffectivePiezoCouplingSquared: 0.19,
  modeledEffectivePiezoCoupling: 0.43588989435406733,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/piezoelectric-coupling-coefficient",
  title: "Semiconductor Piezoelectric Coupling Coefficient Calculator",
  description:
    "Infer effective piezoelectric coupling by explicit 1−(fr/fa)² frequency convention, not all material tensor coupling definitions or mechanically stable device certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledEffectivePiezoCouplingSquared",
      label: "Modeled effective piezo coupling squared",
      kind: "number",
    },
    {
      id: "modeledEffectivePiezoCoupling",
      label: "Modeled effective piezo coupling",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedResonanceHz: value.observedResonanceHz as number,
      observedAntiresonanceHz: value.observedAntiresonanceHz as number,
    }),
});
export const run = tool.execute;
export default tool;
