import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly baselineScore: number;
  readonly followupScore: number;
  readonly normativeSd: number;
  readonly testRetestReliability: number;
  readonly expectedPracticeChange: number;
  readonly absoluteCriticalValue: number;
}>;
export type Output = Readonly<{
  readonly standardErrorDifference: number;
  readonly reliableChangeIndex: number;
  readonly exceedsCriticalValue: boolean;
}>;
const inputFields = [
  { id: "baselineScore", label: "Baseline score", kind: "number" },
  { id: "followupScore", label: "Followup score", kind: "number" },
  { id: "normativeSd", label: "Normative sd", kind: "number" },
  {
    id: "testRetestReliability",
    label: "Test retest reliability",
    kind: "number",
  },
  {
    id: "expectedPracticeChange",
    label: "Expected practice change",
    kind: "number",
  },
  {
    id: "absoluteCriticalValue",
    label: "Absolute critical value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.normativeSd, "normativeSd");
  fraction(input.testRetestReliability, "testRetestReliability");
  positive(input.absoluteCriticalValue, "absoluteCriticalValue");
  if (input.testRetestReliability === 1)
    simpleError(
      "testRetestReliability",
      "Reliability below one required for nonzero change uncertainty.",
    );
  const standardErrorDifference =
      input.normativeSd * Math.sqrt(2 * (1 - input.testRetestReliability)),
    reliableChangeIndex =
      (input.followupScore -
        input.baselineScore -
        input.expectedPracticeChange) /
      standardErrorDifference;
  return {
    standardErrorDifference,
    reliableChangeIndex,
    exceedsCriticalValue:
      Math.abs(reliableChangeIndex) > input.absoluteCriticalValue,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baselineScore: 10,
  followupScore: 14,
  normativeSd: 5,
  testRetestReliability: 0.92,
  expectedPracticeChange: 1,
  absoluteCriticalValue: 1.96,
} satisfies Input;
export const exampleOutput = {
  standardErrorDifference: 2,
  reliableChangeIndex: 1.5,
  exceedsCriticalValue: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/practice-adjusted-reliable-change",
  title: "Reliable Change Index",
  description:
    "Compute a practice-adjusted Jacobson–Truax reliable-change index from caller norms and criterion; not a diagnosis or a universal improvement cutoff.",
  inputs: inputFields,
  outputs: [
    {
      id: "standardErrorDifference",
      label: "Standard error difference",
      kind: "number",
    },
    {
      id: "reliableChangeIndex",
      label: "Reliable change index",
      kind: "number",
    },
    {
      id: "exceedsCriticalValue",
      label: "Exceeds critical value",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      baselineScore: value.baselineScore as number,
      followupScore: value.followupScore as number,
      normativeSd: value.normativeSd as number,
      testRetestReliability: value.testRetestReliability as number,
      expectedPracticeChange: value.expectedPracticeChange as number,
      absoluteCriticalValue: value.absoluteCriticalValue as number,
    }),
});
export const run = tool.execute;
export default tool;
