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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly feedClassTonnesPerHour: readonly number[];
  readonly underflowClassTonnesPerHour: readonly number[];
  readonly classIsCoarseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly finesToOverflowRecovery: number;
  readonly coarseToUnderflowRecovery: number;
  readonly separationEfficiency: number;
}>;
const inputFields = [
  {
    id: "feedClassTonnesPerHour",
    label: "Feed class tonnes per hour",
    kind: "numberList",
  },
  {
    id: "underflowClassTonnesPerHour",
    label: "Underflow class tonnes per hour",
    kind: "numberList",
  },
  {
    id: "classIsCoarseFlags",
    label: "Class is coarse flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.feedClassTonnesPerHour.forEach((v) =>
    nonnegative(v, "feedClassTonnesPerHour"),
  );
  input.underflowClassTonnesPerHour.forEach((v) =>
    nonnegative(v, "underflowClassTonnesPerHour"),
  );
  aligned(
    input.feedClassTonnesPerHour,
    input.underflowClassTonnesPerHour,
    "feedClassTonnesPerHour",
  );
  aligned(
    input.feedClassTonnesPerHour,
    input.classIsCoarseFlags,
    "feedClassTonnesPerHour",
  );
  let fine = 0,
    coarse = 0,
    fo = 0,
    cu = 0;
  input.feedClassTonnesPerHour.forEach((v, i) => {
    const u = input.underflowClassTonnesPerHour[i];
    if (u > v || ![0, 1].includes(input.classIsCoarseFlags[i]))
      simpleError(
        "underflowClassTonnesPerHour",
        "Class balance and binary flags required.",
      );
    if (input.classIsCoarseFlags[i]) {
      coarse += v;
      cu += u;
    } else {
      fine += v;
      fo += v - u;
    }
  });
  positive(fine, "fineFeed");
  positive(coarse, "coarseFeed");
  const finesToOverflowRecovery = fo / fine,
    coarseToUnderflowRecovery = cu / coarse;
  return {
    finesToOverflowRecovery,
    coarseToUnderflowRecovery,
    separationEfficiency: finesToOverflowRecovery * coarseToUnderflowRecovery,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  feedClassTonnesPerHour: [10, 20, 30],
  underflowClassTonnesPerHour: [1, 10, 27],
  classIsCoarseFlags: [0, 0, 1],
} satisfies Input;
export const exampleOutput = {
  finesToOverflowRecovery: 0.6333333333333333,
  coarseToUnderflowRecovery: 0.9,
  separationEfficiency: 0.57,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/cyclone-efficiency",
  title: "Cyclone Efficiency",
  description:
    "Audit fine-overflow and coarse-underflow recovery from size-class flows and cut flags; distinct from corrected d50.",
  inputs: inputFields,
  outputs: [
    {
      id: "finesToOverflowRecovery",
      label: "Fines to overflow recovery",
      kind: "number",
    },
    {
      id: "coarseToUnderflowRecovery",
      label: "Coarse to underflow recovery",
      kind: "number",
    },
    {
      id: "separationEfficiency",
      label: "Separation efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      feedClassTonnesPerHour: value.feedClassTonnesPerHour as readonly number[],
      underflowClassTonnesPerHour:
        value.underflowClassTonnesPerHour as readonly number[],
      classIsCoarseFlags: value.classIsCoarseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
