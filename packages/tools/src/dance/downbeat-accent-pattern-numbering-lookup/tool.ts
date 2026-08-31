import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  binary,
  modulo,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerAccentPatternFlags: readonly number[];
  readonly observedDanceEventCountIndices: readonly number[];
  readonly callerPatternCountOrigin: number;
}>;
export type Output = Readonly<{
  readonly eventOneBasedPatternPositions: readonly number[];
  readonly eventsOnCallerAccentFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "callerAccentPatternFlags",
    label: "Caller accent pattern flags",
    kind: "numberList",
  },
  {
    id: "observedDanceEventCountIndices",
    label: "Observed dance event count indices",
    kind: "numberList",
  },
  {
    id: "callerPatternCountOrigin",
    label: "Caller pattern count origin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.callerAccentPatternFlags, "callerAccentPatternFlags");
  bounded(input.callerPatternCountOrigin, "origin", 0, 1000000);
  if (
    !input.callerAccentPatternFlags.length ||
    input.callerAccentPatternFlags.length > 128
  )
    simpleError(
      "pattern",
      "1–128 explicitly annotated accent positions required.",
    );
  input.observedDanceEventCountIndices.forEach((v) =>
    bounded(v, "event", input.callerPatternCountOrigin, 1000000),
  );
  const positions = input.observedDanceEventCountIndices.map((v) =>
    modulo(
      v - input.callerPatternCountOrigin,
      input.callerAccentPatternFlags.length,
    ),
  );
  return {
    eventOneBasedPatternPositions: positions.map((v) => v + 1),
    eventsOnCallerAccentFlags: positions.map(
      (v) => input.callerAccentPatternFlags[v],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAccentPatternFlags: [1, 0, 1, 0],
  observedDanceEventCountIndices: [0, 1, 4, 6],
  callerPatternCountOrigin: 0,
} satisfies Input;
export const exampleOutput = {
  eventOneBasedPatternPositions: [1, 2, 1, 3],
  eventsOnCallerAccentFlags: [1, 0, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/downbeat-accent-pattern-numbering-lookup",
  title: "Downbeat Accent Pattern Numbering Lookup",
  description:
    "Map actual dance event positions into caller annotated recurring downbeat/accent pattern; does not declare cultural/style accents or infer audio onset strengths.",
  inputs: inputFields,
  outputs: [
    {
      id: "eventOneBasedPatternPositions",
      label: "Event one based pattern positions",
      kind: "numberList",
    },
    {
      id: "eventsOnCallerAccentFlags",
      label: "Events on caller accent flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAccentPatternFlags:
        value.callerAccentPatternFlags as readonly number[],
      observedDanceEventCountIndices:
        value.observedDanceEventCountIndices as readonly number[],
      callerPatternCountOrigin: value.callerPatternCountOrigin as number,
    }),
});
export const run = tool.execute;
export default tool;
