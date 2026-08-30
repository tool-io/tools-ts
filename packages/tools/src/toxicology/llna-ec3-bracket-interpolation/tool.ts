import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  interpolateEffect,
} from "../shared.js";
export type Input = Readonly<{
  readonly testConcentrationsPercent: readonly number[];
  readonly stimulationIndices: readonly number[];
}>;
export type Output = Readonly<{
  readonly ec3ConcentrationPercent: number;
}>;
const inputFields = [
  {
    id: "testConcentrationsPercent",
    label: "Test concentrations percent",
    kind: "numberList",
  },
  {
    id: "stimulationIndices",
    label: "Stimulation indices",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stimulationIndices.forEach((v) => nonnegative(v, "stimulationIndices"));
  if (input.testConcentrationsPercent.some((v) => v > 100))
    simpleError(
      "testConcentrationsPercent",
      "Test concentrations cannot exceed 100 percent.",
    );
  return {
    ec3ConcentrationPercent: interpolateEffect(
      input.testConcentrationsPercent,
      input.stimulationIndices,
      3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  testConcentrationsPercent: [1, 2, 4],
  stimulationIndices: [1, 2, 4],
} satisfies Input;
export const exampleOutput = { ec3ConcentrationPercent: 3 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/llna-ec3-bracket-interpolation",
  title: "LLNA EC3 Dermal Sensitization",
  description:
    "Interpolate LLNA EC3 at stimulation index three from monotone bracketing tested concentrations; does not perform an assay, classify sensitization or extrapolate untested concentrations.",
  inputs: inputFields,
  outputs: [
    {
      id: "ec3ConcentrationPercent",
      label: "Ec3 concentration percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      testConcentrationsPercent:
        value.testConcentrationsPercent as readonly number[],
      stimulationIndices: value.stimulationIndices as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
