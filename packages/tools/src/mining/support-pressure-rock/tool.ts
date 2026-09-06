import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSupportContactForcesKn: readonly number[];
  readonly observedSupportContactAreasM2: readonly number[];
  readonly callerIndependentRequiredPressuresKpa: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSupportPressuresKpa: readonly number[];
  readonly signedPressureMarginsKpa: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSupportContactForcesKn",
    label: "Observed support contact forces kn",
    kind: "numberList",
  },
  {
    id: "observedSupportContactAreasM2",
    label: "Observed support contact areas m2",
    kind: "numberList",
  },
  {
    id: "callerIndependentRequiredPressuresKpa",
    label: "Caller independent required pressures kpa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSupportContactAreasM2.forEach((v) =>
    positive(v, "observedSupportContactAreasM2"),
  );
  input.observedSupportContactForcesKn.forEach((v) =>
    nonnegative(v, "observedSupportContactForcesKn"),
  );
  input.callerIndependentRequiredPressuresKpa.forEach((v) =>
    nonnegative(v, "callerIndependentRequiredPressuresKpa"),
  );
  aligned(
    input.observedSupportContactForcesKn,
    input.observedSupportContactAreasM2,
    "observedSupportContactForcesKn",
  );
  aligned(
    input.observedSupportContactForcesKn,
    input.callerIndependentRequiredPressuresKpa,
    "observedSupportContactForcesKn",
  );
  const p = input.observedSupportContactForcesKn.map(
    (v, i) => v / input.observedSupportContactAreasM2[i],
  );
  return {
    observedSupportPressuresKpa: p,
    signedPressureMarginsKpa: p.map(
      (v, i) => v - input.callerIndependentRequiredPressuresKpa[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSupportContactForcesKn: [10, 20],
  observedSupportContactAreasM2: [1, 2],
  callerIndependentRequiredPressuresKpa: [8, 12],
} satisfies Input;
export const exampleOutput = {
  observedSupportPressuresKpa: [10, 10],
  signedPressureMarginsKpa: [2, -2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/support-pressure-rock",
  title: "Rock Support Pressure Calculator",
  description:
    "Audit actual support contact load/area versus independent pressure-demand evidence, not prescribed ground-reaction pressure or support adequacy. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSupportPressuresKpa",
      label: "Observed support pressures kpa",
      kind: "numberList",
    },
    {
      id: "signedPressureMarginsKpa",
      label: "Signed pressure margins kpa",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSupportContactForcesKn:
        value.observedSupportContactForcesKn as readonly number[],
      observedSupportContactAreasM2:
        value.observedSupportContactAreasM2 as readonly number[],
      callerIndependentRequiredPressuresKpa:
        value.callerIndependentRequiredPressuresKpa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
