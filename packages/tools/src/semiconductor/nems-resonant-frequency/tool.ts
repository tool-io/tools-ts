import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerNemsModalStiffnessNPerM: number;
  readonly callerNemsEffectiveModalMassKg: number;
}>;
export type Output = Readonly<{ readonly modeledNemsResonanceHz: number }>;
const inputFields = [
  {
    id: "callerNemsModalStiffnessNPerM",
    label: "Caller nems modal stiffness n per m",
    kind: "number",
  },
  {
    id: "callerNemsEffectiveModalMassKg",
    label: "Caller nems effective modal mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerNemsModalStiffnessNPerM,
    "callerNemsModalStiffnessNPerM",
  );
  positive(
    input.callerNemsEffectiveModalMassKg,
    "callerNemsEffectiveModalMassKg",
  );
  return {
    modeledNemsResonanceHz:
      Math.sqrt(
        input.callerNemsModalStiffnessNPerM /
          input.callerNemsEffectiveModalMassKg,
      ) /
      (2 * Math.PI),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNemsModalStiffnessNPerM: 4,
  callerNemsEffectiveModalMassKg: 1,
} satisfies Input;
export const exampleOutput = {
  modeledNemsResonanceHz: 0.3183098861837907,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/nems-resonant-frequency",
  title: "Semiconductor Nems Resonant Frequency Calculator",
  description:
    "Evaluate independently established NEMS modal stiffness/effective mass harmonic resonance, not assumed beam boundary-condition stiffness or measured spectral peak assignment.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledNemsResonanceHz",
      label: "Modeled nems resonance hz",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerNemsModalStiffnessNPerM:
        value.callerNemsModalStiffnessNPerM as number,
      callerNemsEffectiveModalMassKg:
        value.callerNemsEffectiveModalMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
