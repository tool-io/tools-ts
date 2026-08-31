import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly measuredTensileStressesPa: readonly number[];
  readonly callerTensileStrengthLowerPa: number;
  readonly callerTensileStrengthUpperPa: number;
}>;
export type Output = Readonly<{
  readonly belowCallerStrengthRangeIndices: readonly number[];
  readonly withinCallerUncertaintyRangeIndices: readonly number[];
  readonly aboveCallerStrengthRangeIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredTensileStressesPa",
    label: "Measured tensile stresses pa",
    kind: "numberList",
  },
  {
    id: "callerTensileStrengthLowerPa",
    label: "Caller tensile strength lower pa",
    kind: "number",
  },
  {
    id: "callerTensileStrengthUpperPa",
    label: "Caller tensile strength upper pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerTensileStrengthLowerPa,
    "callerTensileStrengthLowerPa",
  );
  nonnegative(
    input.callerTensileStrengthUpperPa,
    "callerTensileStrengthUpperPa",
  );
  if (input.callerTensileStrengthUpperPa < input.callerTensileStrengthLowerPa)
    simpleError(
      "strength",
      "Ordered caller material strength uncertainty required.",
    );
  return {
    belowCallerStrengthRangeIndices: input.measuredTensileStressesPa.flatMap(
      (v, i) => (v < input.callerTensileStrengthLowerPa ? [i] : []),
    ),
    withinCallerUncertaintyRangeIndices:
      input.measuredTensileStressesPa.flatMap((v, i) =>
        v >= input.callerTensileStrengthLowerPa &&
        v <= input.callerTensileStrengthUpperPa
          ? [i]
          : [],
      ),
    aboveCallerStrengthRangeIndices: input.measuredTensileStressesPa.flatMap(
      (v, i) => (v > input.callerTensileStrengthUpperPa ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredTensileStressesPa: [10, 20],
  callerTensileStrengthLowerPa: 15,
  callerTensileStrengthUpperPa: 25,
} satisfies Input;
export const exampleOutput = {
  belowCallerStrengthRangeIndices: [0],
  withinCallerUncertaintyRangeIndices: [1],
  aboveCallerStrengthRangeIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/tensile-strength-crevasse-limit-checker",
  title: "Tensile Strength Crevasse Limit Checker",
  description:
    "Screen caller observed tensile stresses against explicit uncertain material strength range; below range does not imply crevasse-free ice, structural stability or safe travel.",
  inputs: inputFields,
  outputs: [
    {
      id: "belowCallerStrengthRangeIndices",
      label: "Below caller strength range indices",
      kind: "numberList",
    },
    {
      id: "withinCallerUncertaintyRangeIndices",
      label: "Within caller uncertainty range indices",
      kind: "numberList",
    },
    {
      id: "aboveCallerStrengthRangeIndices",
      label: "Above caller strength range indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredTensileStressesPa:
        value.measuredTensileStressesPa as readonly number[],
      callerTensileStrengthLowerPa:
        value.callerTensileStrengthLowerPa as number,
      callerTensileStrengthUpperPa:
        value.callerTensileStrengthUpperPa as number,
    }),
});
export const run = tool.execute;
export default tool;
