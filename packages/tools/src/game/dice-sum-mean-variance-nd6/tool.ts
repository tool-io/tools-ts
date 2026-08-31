import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  bounded,
  dice,
} from "../shared.js";
export type Input = Readonly<{
  readonly independentD6Count: number;
  readonly callerFaceProbabilityWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly singleDieMean: number;
  readonly sumMean: number;
  readonly sumVariance: number;
}>;
const inputFields = [
  { id: "independentD6Count", label: "Independent d6 count", kind: "number" },
  {
    id: "callerFaceProbabilityWeights",
    label: "Caller face probability weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerFaceProbabilityWeights.forEach((v) =>
    nonnegative(v, "callerFaceProbabilityWeights"),
  );
  bounded(input.independentD6Count, "dice", 1, 1000000);
  if (input.callerFaceProbabilityWeights.length !== 6)
    simpleError("weights", "Six explicit face weights required.");
  const total = positive(sum(input.callerFaceProbabilityWeights), "weights"),
    m = input.callerFaceProbabilityWeights.reduce(
      (s, v, i) => s + ((i + 1) * v) / total,
      0,
    ),
    variance = input.callerFaceProbabilityWeights.reduce(
      (s, v, i) => s + ((i + 1 - m) ** 2 * v) / total,
      0,
    );
  return {
    singleDieMean: m,
    sumMean: input.independentD6Count * m,
    sumVariance: input.independentD6Count * variance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentD6Count: 2,
  callerFaceProbabilityWeights: [1, 1, 1, 1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  singleDieMean: 3.5,
  sumMean: 7,
  sumVariance: 5.833333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/dice-sum-mean-variance-nd6",
  title: "Nd6 Dice Sum Mean & Variance",
  description:
    "Compute mean/variance for N independent identically weighted d6 from caller face weights; unlike generic sample statistics, weights describe a probability model and no correlated-dice assumption is hidden.",
  inputs: inputFields,
  outputs: [
    { id: "singleDieMean", label: "Single die mean", kind: "number" },
    { id: "sumMean", label: "Sum mean", kind: "number" },
    { id: "sumVariance", label: "Sum variance", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      independentD6Count: value.independentD6Count as number,
      callerFaceProbabilityWeights:
        value.callerFaceProbabilityWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
