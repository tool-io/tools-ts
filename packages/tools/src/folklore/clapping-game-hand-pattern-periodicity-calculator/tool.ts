import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  minimalObservedPeriod,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly independentlyObservedGestureIds: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyObservedGestureIds",
    label: "Independently observed gesture ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return minimalObservedPeriod(input.independentlyObservedGestureIds);
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyObservedGestureIds: ["clap", "tap", "clap", "tap", "clap"],
  },
  output: {
    result: {
      minimalObservedPeriod: 2,
      completeObservedCycles: 2,
      trailingObservedTokens: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/clapping-game-hand-pattern-periodicity-calculator",
  title: "Clapping Game Hand Pattern Periodicity Calculator",
  description:
    "Minimal exact gesture-ID period consistent with observed clapping-game prefix; incomplete cycle retained. Does not predict future gestures or establish cultural lineage.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimalObservedPeriod: { type: "number" },
          completeObservedCycles: { type: "number" },
          trailingObservedTokens: { type: "number" },
        },
        required: [
          "minimalObservedPeriod",
          "completeObservedCycles",
          "trailingObservedTokens",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
