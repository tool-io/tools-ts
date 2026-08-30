import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly jointSetNormalSpacingsM: readonly number[];
  readonly randomJointFrequencyPerM: number;
}>;
export type Output = Readonly<{ readonly volumetricJointCountPerM: number }>;
const inputFields = [
  {
    id: "jointSetNormalSpacingsM",
    label: "Joint set normal spacings m",
    kind: "numberList",
  },
  {
    id: "randomJointFrequencyPerM",
    label: "Random joint frequency per m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.jointSetNormalSpacingsM.forEach((v) =>
    positive(v, "jointSetNormalSpacingsM"),
  );
  nonnegative(input.randomJointFrequencyPerM, "randomJointFrequencyPerM");
  if (!input.jointSetNormalSpacingsM.length)
    simpleError(
      "jointSetNormalSpacingsM",
      "Nonempty normal spacings required.",
    );
  return {
    volumetricJointCountPerM:
      input.jointSetNormalSpacingsM.reduce((s, v) => s + 1 / v, 0) +
      input.randomJointFrequencyPerM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  jointSetNormalSpacingsM: [0.5, 1, 2],
  randomJointFrequencyPerM: 0.5,
} satisfies Input;
export const exampleOutput = { volumetricJointCountPerM: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/joint-volume-jv",
  title: "Joint Volume Jv",
  description:
    "Calculate Jv as reciprocal normal spacings plus random-joint frequency; conventional Jv units are m⁻¹ despite its name, with no assumed RQD conversion.",
  inputs: inputFields,
  outputs: [
    {
      id: "volumetricJointCountPerM",
      label: "Volumetric joint count per m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      jointSetNormalSpacingsM:
        value.jointSetNormalSpacingsM as readonly number[],
      randomJointFrequencyPerM: value.randomJointFrequencyPerM as number,
    }),
});
export const run = tool.execute;
export default tool;
