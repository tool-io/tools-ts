import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerAnnotatedDancerLevelCodes: readonly number[];
  readonly levelObservationFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownLowMidHighDancerCounts: readonly number[];
  readonly unknownLevelDancerCount: number;
  readonly knownLevelBalanceSpread: number;
}>;
const inputFields = [
  {
    id: "callerAnnotatedDancerLevelCodes",
    label: "Caller annotated dancer level codes",
    kind: "numberList",
  },
  {
    id: "levelObservationFlags",
    label: "Level observation flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.levelObservationFlags, "levelObservationFlags");
  aligned(
    input.callerAnnotatedDancerLevelCodes,
    input.levelObservationFlags,
    "callerAnnotatedDancerLevelCodes",
  );
  input.callerAnnotatedDancerLevelCodes.forEach((v) =>
    bounded(v, "level", 0, 2),
  );
  const counts = [0, 1, 2].map(
    (c) =>
      input.callerAnnotatedDancerLevelCodes.filter(
        (v, i) => v === c && input.levelObservationFlags[i] === 1,
      ).length,
  );
  return {
    knownLowMidHighDancerCounts: counts,
    unknownLevelDancerCount: input.levelObservationFlags.filter((v) => v === 0)
      .length,
    knownLevelBalanceSpread: Math.max(...counts) - Math.min(...counts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnnotatedDancerLevelCodes: [0, 1, 2, 2, 0],
  levelObservationFlags: [1, 1, 1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownLowMidHighDancerCounts: [2, 1, 1],
  unknownLevelDancerCount: 1,
  knownLevelBalanceSpread: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/level-change-low-mid-high-distribution-counter",
  title: "Level Change Low Mid High Distribution Counter",
  description:
    "Inventory actual caller low/mid/high dancer annotations with unknown observations distinct; no fixed body-height classification, image recognition or preferred level balance.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownLowMidHighDancerCounts",
      label: "Known low mid high dancer counts",
      kind: "numberList",
    },
    {
      id: "unknownLevelDancerCount",
      label: "Unknown level dancer count",
      kind: "number",
    },
    {
      id: "knownLevelBalanceSpread",
      label: "Known level balance spread",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAnnotatedDancerLevelCodes:
        value.callerAnnotatedDancerLevelCodes as readonly number[],
      levelObservationFlags: value.levelObservationFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
