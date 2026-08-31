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
  strictlyIncreasing,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedQuickstepFigureStartBarPositions: readonly number[];
  readonly observedPhraseEndBarPosition: number;
  readonly measuredBarsPerMinute: number;
}>;
export type Output = Readonly<{
  readonly figureSpansBars: readonly number[];
  readonly figureStartSeconds: readonly number[];
  readonly observedFiguresPerMinute: number;
}>;
const inputFields = [
  {
    id: "observedQuickstepFigureStartBarPositions",
    label: "Observed quickstep figure start bar positions",
    kind: "numberList",
  },
  {
    id: "observedPhraseEndBarPosition",
    label: "Observed phrase end bar position",
    kind: "number",
  },
  {
    id: "measuredBarsPerMinute",
    label: "Measured bars per minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedPhraseEndBarPosition, "observedPhraseEndBarPosition");
  positive(input.measuredBarsPerMinute, "measuredBarsPerMinute");
  sequence(input.observedQuickstepFigureStartBarPositions, "figures");
  strictlyIncreasing(
    input.observedQuickstepFigureStartBarPositions,
    "starts",
    1,
  );
  if (
    input.observedQuickstepFigureStartBarPositions[0] !== 0 ||
    input.observedQuickstepFigureStartBarPositions.at(-1)! >=
      input.observedPhraseEndBarPosition
  )
    simpleError(
      "phrase",
      "Figure starts begin zero and precede explicit phrase end.",
    );
  const ends = [
    ...input.observedQuickstepFigureStartBarPositions.slice(1),
    input.observedPhraseEndBarPosition,
  ];
  return {
    figureSpansBars: ends.map(
      (v, i) => v - input.observedQuickstepFigureStartBarPositions[i],
    ),
    figureStartSeconds: input.observedQuickstepFigureStartBarPositions.map(
      (v) => (v * 60) / input.measuredBarsPerMinute,
    ),
    observedFiguresPerMinute:
      (input.observedQuickstepFigureStartBarPositions.length /
        input.observedPhraseEndBarPosition) *
      input.measuredBarsPerMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQuickstepFigureStartBarPositions: [0, 2, 4],
  observedPhraseEndBarPosition: 8,
  measuredBarsPerMinute: 50,
} satisfies Input;
export const exampleOutput = {
  figureSpansBars: [2, 2, 4],
  figureStartSeconds: [0, 2.4, 4.8],
  observedFiguresPerMinute: 18.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/quickstep-bars-per-minute-figure-density",
  title: "Quickstep Bars Per Minute Figure Density",
  description:
    "Analyze actual quickstep figure start-bar log and observed phrase end at measured bars/minute, preserving variable figure spans; not guessed standard figure density or BPM/count conversion.",
  inputs: inputFields,
  outputs: [
    { id: "figureSpansBars", label: "Figure spans bars", kind: "numberList" },
    {
      id: "figureStartSeconds",
      label: "Figure start seconds",
      kind: "numberList",
    },
    {
      id: "observedFiguresPerMinute",
      label: "Observed figures per minute",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQuickstepFigureStartBarPositions:
        value.observedQuickstepFigureStartBarPositions as readonly number[],
      observedPhraseEndBarPosition:
        value.observedPhraseEndBarPosition as number,
      measuredBarsPerMinute: value.measuredBarsPerMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
