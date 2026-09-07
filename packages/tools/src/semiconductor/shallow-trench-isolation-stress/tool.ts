import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, shape } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedStiStrainVoigt: readonly number[];
  readonly callerMatchedElasticStiffnessPa: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly modeledStiStressComponentsPa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedStiStrainVoigt",
    label: "Observed sti strain voigt",
    kind: "numberList",
  },
  {
    id: "callerMatchedElasticStiffnessPa",
    label: "Caller matched elastic stiffness pa",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedStiStrainVoigt.length !== 3 ||
    shape(input.callerMatchedElasticStiffnessPa, "stiffness") !== 3 ||
    input.callerMatchedElasticStiffnessPa.length !== 3
  )
    simpleError(
      "elastic",
      "Explicit caller local three-component reduced stiffness/strain required.",
    );
  return {
    modeledStiStressComponentsPa: input.callerMatchedElasticStiffnessPa.map(
      (row) => sum(row.map((v, i) => v * input.observedStiStrainVoigt[i])),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedStiStrainVoigt: [0.001, 0.002, 0],
  callerMatchedElasticStiffnessPa: [
    [100, 20, 0],
    [20, 100, 0],
    [0, 0, 50],
  ],
} satisfies Input;
export const exampleOutput = {
  modeledStiStressComponentsPa: [0.14, 0.22, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/shallow-trench-isolation-stress",
  title: "Semiconductor Shallow Trench Isolation Stress Calculator",
  description:
    "Resolve observed STI reduced strain through independently matched three-component elastic stiffness in one explicit caller local convention; no full 3D stress inversion or isolation safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledStiStressComponentsPa",
      label: "Modeled sti stress components pa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedStiStrainVoigt: value.observedStiStrainVoigt as readonly number[],
      callerMatchedElasticStiffnessPa:
        value.callerMatchedElasticStiffnessPa as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
