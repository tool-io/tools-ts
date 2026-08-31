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
  literal,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerFoxtrotStepTokens: readonly string[];
  readonly callerSlowBeatValue: number;
  readonly callerQuickBeatValue: number;
  readonly callerFirstStepBeat: number;
}>;
export type Output = Readonly<{
  readonly stepStartBeatPositions: readonly number[];
  readonly stepDurationBeats: readonly number[];
  readonly phraseEndBeatPosition: number;
}>;
const inputFields = [
  {
    id: "callerFoxtrotStepTokens",
    label: "Caller foxtrot step tokens",
    kind: "stringList",
  },
  {
    id: "callerSlowBeatValue",
    label: "Caller slow beat value",
    kind: "number",
  },
  {
    id: "callerQuickBeatValue",
    label: "Caller quick beat value",
    kind: "number",
  },
  {
    id: "callerFirstStepBeat",
    label: "Caller first step beat",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerSlowBeatValue, "callerSlowBeatValue");
  positive(input.callerQuickBeatValue, "callerQuickBeatValue");
  nonnegative(input.callerFirstStepBeat, "callerFirstStepBeat");
  if (!input.callerFoxtrotStepTokens.length)
    simpleError("steps", "Actual annotated foxtrot step sequence required.");
  input.callerFoxtrotStepTokens.forEach((v) => literal(v, ["S", "Q"], "step"));
  const durations = input.callerFoxtrotStepTokens.map((v) =>
    v === "S" ? input.callerSlowBeatValue : input.callerQuickBeatValue,
  );
  let end = input.callerFirstStepBeat;
  const starts = durations.map((v) => {
    const start = end;
    end += v;
    return start;
  });
  return {
    stepStartBeatPositions: starts,
    stepDurationBeats: durations,
    phraseEndBeatPosition: end,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFoxtrotStepTokens: ["S", "Q", "Q"],
  callerSlowBeatValue: 2,
  callerQuickBeatValue: 1,
  callerFirstStepBeat: 0,
} satisfies Input;
export const exampleOutput = {
  stepStartBeatPositions: [0, 2, 3],
  stepDurationBeats: [2, 1, 1],
  phraseEndBeatPosition: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/foxtrot-slow-quick-rhythm-value-lookup",
  title: "Foxtrot Slow Quick Rhythm Value Lookup",
  description:
    "Expand actual caller foxtrot slow/quick annotated score with explicitly supplied beat values and anchor; not static rhythm vocabulary or automatic valid figure grammar.",
  inputs: inputFields,
  outputs: [
    {
      id: "stepStartBeatPositions",
      label: "Step start beat positions",
      kind: "numberList",
    },
    {
      id: "stepDurationBeats",
      label: "Step duration beats",
      kind: "numberList",
    },
    {
      id: "phraseEndBeatPosition",
      label: "Phrase end beat position",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFoxtrotStepTokens:
        value.callerFoxtrotStepTokens as readonly string[],
      callerSlowBeatValue: value.callerSlowBeatValue as number,
      callerQuickBeatValue: value.callerQuickBeatValue as number,
      callerFirstStepBeat: value.callerFirstStepBeat as number,
    }),
});
export const run = tool.execute;
export default tool;
