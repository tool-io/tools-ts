import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  capacity,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerStormDrainIds: readonly string[];
  readonly callerMatchedStormDrainCapacityLitersSecond: readonly number[];
  readonly observedDesignStormDrainLitersSecond: number;
}>;
export type Output = Readonly<{
  readonly callerCompatibleCandidateIds: readonly string[];
  readonly signedCandidateCapacityMarginsLitersSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "callerStormDrainIds",
    label: "Caller storm drain ids",
    kind: "stringList",
  },
  {
    id: "callerMatchedStormDrainCapacityLitersSecond",
    label: "Caller matched storm drain capacity liters second",
    kind: "numberList",
  },
  {
    id: "observedDesignStormDrainLitersSecond",
    label: "Observed design storm drain liters second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedStormDrainCapacityLitersSecond.forEach((v) =>
    nonnegative(v, "callerMatchedStormDrainCapacityLitersSecond"),
  );
  nonnegative(
    input.observedDesignStormDrainLitersSecond,
    "observedDesignStormDrainLitersSecond",
  );
  return {
    callerCompatibleCandidateIds: capacity(
      input.callerStormDrainIds,
      input.callerMatchedStormDrainCapacityLitersSecond,
      input.observedDesignStormDrainLitersSecond,
    ),
    signedCandidateCapacityMarginsLitersSecond:
      input.callerMatchedStormDrainCapacityLitersSecond.map(
        (v) => v - input.observedDesignStormDrainLitersSecond,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerStormDrainIds: ["a", "b", "c"],
  callerMatchedStormDrainCapacityLitersSecond: [5, 10, 20],
  observedDesignStormDrainLitersSecond: 8,
} satisfies Input;
export const exampleOutput = {
  callerCompatibleCandidateIds: ["b", "c"],
  signedCandidateCapacityMarginsLitersSecond: [-3, 2, 12],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/storm-drain-size",
  title: "Plumbing Storm Drain Size Calculator",
  description:
    "Screen actual storm drain demand against independently verified matched head/slope candidate capacities; no universal rainfall, pipe code table or flood protection approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCompatibleCandidateIds",
      label: "Caller compatible candidate ids",
      kind: "stringList",
    },
    {
      id: "signedCandidateCapacityMarginsLitersSecond",
      label: "Signed candidate capacity margins liters second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerStormDrainIds: value.callerStormDrainIds as readonly string[],
      callerMatchedStormDrainCapacityLitersSecond:
        value.callerMatchedStormDrainCapacityLitersSecond as readonly number[],
      observedDesignStormDrainLitersSecond:
        value.observedDesignStormDrainLitersSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
