import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly startStopPercent: number;
  readonly endStopPercent: number;
  readonly stopCount: number;
}>;
export type Output = Readonly<{
  readonly evenGradientStopPercents: readonly number[];
  readonly intervalPercent: number;
}>;
const inputFields = [
  { id: "startStopPercent", label: "Start stop percent", kind: "number" },
  { id: "endStopPercent", label: "End stop percent", kind: "number" },
  { id: "stopCount", label: "Stop count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.stopCount, "stops", 2, 128);
  if (
    input.startStopPercent < 0 ||
    input.endStopPercent > 100 ||
    input.endStopPercent < input.startStopPercent
  )
    simpleError(
      "positions",
      "Ordered normalized [0,100] gradient stop endpoints required.",
    );
  const spacing =
    (input.endStopPercent - input.startStopPercent) / (input.stopCount - 1);
  return {
    evenGradientStopPercents: Array.from({ length: input.stopCount }, (_, i) =>
      i === input.stopCount - 1
        ? input.endStopPercent
        : input.startStopPercent + i * spacing,
    ),
    intervalPercent: spacing,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  startStopPercent: 10,
  endStopPercent: 90,
  stopCount: 3,
} satisfies Input;
export const exampleOutput = {
  evenGradientStopPercents: [10, 50, 90],
  intervalPercent: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/gradient-stop-even-spacing-count",
  title: "Gradient Stop Even Spacing Count",
  description:
    "Build bounded endpoint-inclusive gradient stop positions in explicit percentage units; repeated coincident stops are permitted, color interpolation/hard-stop semantics are not guessed.",
  inputs: inputFields,
  outputs: [
    {
      id: "evenGradientStopPercents",
      label: "Even gradient stop percents",
      kind: "numberList",
    },
    { id: "intervalPercent", label: "Interval percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      startStopPercent: value.startStopPercent as number,
      endStopPercent: value.endStopPercent as number,
      stopCount: value.stopCount as number,
    }),
});
export const run = tool.execute;
export default tool;
