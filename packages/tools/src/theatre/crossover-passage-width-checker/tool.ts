import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedCrossoverStationWidthsM: readonly number[];
  readonly callerPassageMinimumM: number;
}>;
export type Output = Readonly<{
  readonly narrowestObservedCrossoverWidthM: number;
  readonly belowPolicyStationIndices: readonly number[];
  readonly signedNarrowestWidthMarginM: number;
}>;
const inputFields = [
  {
    id: "observedCrossoverStationWidthsM",
    label: "Observed crossover station widths m",
    kind: "numberList",
  },
  {
    id: "callerPassageMinimumM",
    label: "Caller passage minimum m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCrossoverStationWidthsM.forEach((v) =>
    positive(v, "observedCrossoverStationWidthsM"),
  );
  positive(input.callerPassageMinimumM, "callerPassageMinimumM");
  if (!input.observedCrossoverStationWidthsM.length)
    simpleError("stations", "Observed passage stations required.");
  const width = Math.min(...input.observedCrossoverStationWidthsM);
  return {
    narrowestObservedCrossoverWidthM: width,
    belowPolicyStationIndices: input.observedCrossoverStationWidthsM.flatMap(
      (v, i) => (v < input.callerPassageMinimumM ? [i] : []),
    ),
    signedNarrowestWidthMarginM: width - input.callerPassageMinimumM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCrossoverStationWidthsM: [1.2, 1, 0.8],
  callerPassageMinimumM: 1,
} satisfies Input;
export const exampleOutput = {
  narrowestObservedCrossoverWidthM: 0.8,
  belowPolicyStationIndices: [2],
  signedNarrowestWidthMarginM: -0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/crossover-passage-width-checker",
  title: "Crossover Passage Width Checker",
  description:
    "Audit measured crossover bottlenecks against explicit caller width policy; unsampled obstructions, occupant flow, accessibility and legal egress remain unverified.",
  inputs: inputFields,
  outputs: [
    {
      id: "narrowestObservedCrossoverWidthM",
      label: "Narrowest observed crossover width m",
      kind: "number",
    },
    {
      id: "belowPolicyStationIndices",
      label: "Below policy station indices",
      kind: "numberList",
    },
    {
      id: "signedNarrowestWidthMarginM",
      label: "Signed narrowest width margin m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCrossoverStationWidthsM:
        value.observedCrossoverStationWidthsM as readonly number[],
      callerPassageMinimumM: value.callerPassageMinimumM as number,
    }),
});
export const run = tool.execute;
export default tool;
