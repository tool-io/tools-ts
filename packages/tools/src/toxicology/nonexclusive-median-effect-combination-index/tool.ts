import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly componentDoses: readonly number[];
  readonly medianEffectDoses: readonly number[];
  readonly medianEffectSlopes: readonly number[];
  readonly targetAffectedFraction: number;
}>;
export type Output = Readonly<{
  readonly singleAgentTargetDoses: readonly number[];
  readonly doseRatios: readonly number[];
  readonly nonexclusiveCombinationIndex: number;
}>;
const inputFields = [
  { id: "componentDoses", label: "Component doses", kind: "numberList" },
  { id: "medianEffectDoses", label: "Median effect doses", kind: "numberList" },
  {
    id: "medianEffectSlopes",
    label: "Median effect slopes",
    kind: "numberList",
  },
  {
    id: "targetAffectedFraction",
    label: "Target affected fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.componentDoses.length !== 2 ||
    input.medianEffectDoses.length !== 2 ||
    input.medianEffectSlopes.length !== 2
  )
    simpleError(
      "componentDoses",
      "Exactly two agents required for the nonexclusive two-agent index.",
    );
  input.componentDoses.forEach((v) => nonnegative(v, "componentDoses"));
  input.medianEffectDoses.forEach((v) => positive(v, "medianEffectDoses"));
  input.medianEffectSlopes.forEach((v) => positive(v, "medianEffectSlopes"));
  if (input.targetAffectedFraction <= 0 || input.targetAffectedFraction >= 1)
    simpleError(
      "targetAffectedFraction",
      "Interior affected fraction required.",
    );
  const odds =
      input.targetAffectedFraction / (1 - input.targetAffectedFraction),
    singleAgentTargetDoses = input.medianEffectDoses.map(
      (v, i) => v * odds ** (1 / input.medianEffectSlopes[i]),
    ),
    doseRatios = input.componentDoses.map(
      (v, i) => v / positive(singleAgentTargetDoses[i], "model"),
    );
  return {
    singleAgentTargetDoses,
    doseRatios,
    nonexclusiveCombinationIndex:
      doseRatios[0] + doseRatios[1] + doseRatios[0] * doseRatios[1],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentDoses: [2, 4],
  medianEffectDoses: [10, 20],
  medianEffectSlopes: [1, 1],
  targetAffectedFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  singleAgentTargetDoses: [10, 20],
  doseRatios: [0.2, 0.2],
  nonexclusiveCombinationIndex: 0.44,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/nonexclusive-median-effect-combination-index",
  title: "Combination Index",
  description:
    "Calculate a nonexclusive two-agent median-effect combination index including the product term; materially distinct from the simple Loewe isobole sum and dependent on externally fitted single-agent curves.",
  inputs: inputFields,
  outputs: [
    {
      id: "singleAgentTargetDoses",
      label: "Single agent target doses",
      kind: "numberList",
    },
    { id: "doseRatios", label: "Dose ratios", kind: "numberList" },
    {
      id: "nonexclusiveCombinationIndex",
      label: "Nonexclusive combination index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentDoses: value.componentDoses as readonly number[],
      medianEffectDoses: value.medianEffectDoses as readonly number[],
      medianEffectSlopes: value.medianEffectSlopes as readonly number[],
      targetAffectedFraction: value.targetAffectedFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
