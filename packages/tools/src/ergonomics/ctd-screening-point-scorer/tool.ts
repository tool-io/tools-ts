import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedCtdScreenFlags: readonly number[];
  readonly knownCtdScreenFlags: readonly number[];
  readonly callerCtdScreenPointWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownScreenPoints: number;
  readonly unassessedMaximumAdditionalPoints: number;
}>;
const inputFields = [
  {
    id: "observedCtdScreenFlags",
    label: "Observed ctd screen flags",
    kind: "numberList",
  },
  {
    id: "knownCtdScreenFlags",
    label: "Known ctd screen flags",
    kind: "numberList",
  },
  {
    id: "callerCtdScreenPointWeights",
    label: "Caller ctd screen point weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCtdScreenPointWeights.forEach((v) =>
    nonnegative(v, "callerCtdScreenPointWeights"),
  );
  binary(input.observedCtdScreenFlags, "observedCtdScreenFlags");
  binary(input.knownCtdScreenFlags, "knownCtdScreenFlags");
  aligned(
    input.observedCtdScreenFlags,
    input.knownCtdScreenFlags,
    "observedCtdScreenFlags",
  );
  aligned(
    input.observedCtdScreenFlags,
    input.callerCtdScreenPointWeights,
    "observedCtdScreenFlags",
  );
  return {
    knownScreenPoints: sum(
      input.callerCtdScreenPointWeights.map((w, i) =>
        input.knownCtdScreenFlags[i] ? w * input.observedCtdScreenFlags[i] : 0,
      ),
    ),
    unassessedMaximumAdditionalPoints: sum(
      input.callerCtdScreenPointWeights.map((w, i) =>
        input.knownCtdScreenFlags[i] ? 0 : w,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCtdScreenFlags: [1, 0, 1],
  knownCtdScreenFlags: [1, 0, 1],
  callerCtdScreenPointWeights: [2, 3, 4],
} satisfies Input;
export const exampleOutput = {
  knownScreenPoints: 6,
  unassessedMaximumAdditionalPoints: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/ctd-screening-point-scorer",
  title: "Cumulative Trauma Disorder Risk Screening Point Scorer",
  description:
    "Independent CTD observed factor presence and explicitly caller weights, no medical diagnosis or invented validated screening scale. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "knownScreenPoints", label: "Known screen points", kind: "number" },
    {
      id: "unassessedMaximumAdditionalPoints",
      label: "Unassessed maximum additional points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCtdScreenFlags: value.observedCtdScreenFlags as readonly number[],
      knownCtdScreenFlags: value.knownCtdScreenFlags as readonly number[],
      callerCtdScreenPointWeights:
        value.callerCtdScreenPointWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
