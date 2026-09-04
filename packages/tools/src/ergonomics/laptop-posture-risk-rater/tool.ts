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
  readonly observedLaptopPostureFlags: readonly number[];
  readonly knownLaptopPostureFlags: readonly number[];
  readonly callerLaptopPosturePointWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownScreenPoints: number;
  readonly unassessedMaximumAdditionalPoints: number;
}>;
const inputFields = [
  {
    id: "observedLaptopPostureFlags",
    label: "Observed laptop posture flags",
    kind: "numberList",
  },
  {
    id: "knownLaptopPostureFlags",
    label: "Known laptop posture flags",
    kind: "numberList",
  },
  {
    id: "callerLaptopPosturePointWeights",
    label: "Caller laptop posture point weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerLaptopPosturePointWeights.forEach((v) =>
    nonnegative(v, "callerLaptopPosturePointWeights"),
  );
  binary(input.observedLaptopPostureFlags, "observedLaptopPostureFlags");
  binary(input.knownLaptopPostureFlags, "knownLaptopPostureFlags");
  aligned(
    input.observedLaptopPostureFlags,
    input.knownLaptopPostureFlags,
    "observedLaptopPostureFlags",
  );
  aligned(
    input.observedLaptopPostureFlags,
    input.callerLaptopPosturePointWeights,
    "observedLaptopPostureFlags",
  );
  return {
    knownScreenPoints: sum(
      input.callerLaptopPosturePointWeights.map((w, i) =>
        input.knownLaptopPostureFlags[i]
          ? w * input.observedLaptopPostureFlags[i]
          : 0,
      ),
    ),
    unassessedMaximumAdditionalPoints: sum(
      input.callerLaptopPosturePointWeights.map((w, i) =>
        input.knownLaptopPostureFlags[i] ? 0 : w,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLaptopPostureFlags: [1, 0, 1],
  knownLaptopPostureFlags: [1, 0, 1],
  callerLaptopPosturePointWeights: [2, 3, 4],
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
  id: "ergonomics/laptop-posture-risk-rater",
  title: "Laptop-only Posture Risk Score Quick Rater",
  description:
    "Laptop-only measured neck/viewing/keyboard posture indicators under caller quick-screen scoring; not full REBA. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      observedLaptopPostureFlags:
        value.observedLaptopPostureFlags as readonly number[],
      knownLaptopPostureFlags:
        value.knownLaptopPostureFlags as readonly number[],
      callerLaptopPosturePointWeights:
        value.callerLaptopPosturePointWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
