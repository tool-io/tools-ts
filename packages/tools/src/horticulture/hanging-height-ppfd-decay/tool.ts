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
  interpolate,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedLampHeightsM: readonly number[];
  readonly matchedObservedPpfd: readonly number[];
  readonly queryLampHeightM: number;
}>;
export type Output = Readonly<{ readonly interpolatedMatchedPpfd: number }>;
const inputFields = [
  {
    id: "observedLampHeightsM",
    label: "Observed lamp heights m",
    kind: "numberList",
  },
  {
    id: "matchedObservedPpfd",
    label: "Matched observed ppfd",
    kind: "numberList",
  },
  { id: "queryLampHeightM", label: "Query lamp height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLampHeightsM.forEach((v) =>
    positive(v, "observedLampHeightsM"),
  );
  positive(input.queryLampHeightM, "queryLampHeightM");
  input.matchedObservedPpfd.forEach((v) =>
    nonnegative(v, "matchedObservedPpfd"),
  );
  if (
    input.matchedObservedPpfd.some(
      (v, i) => i > 0 && v > input.matchedObservedPpfd[i - 1],
    )
  )
    simpleError(
      "calibration",
      "Nonincreasing caller matched height/PPFD branch required.",
    );
  return {
    interpolatedMatchedPpfd: interpolate(
      input.observedLampHeightsM,
      input.matchedObservedPpfd,
      input.queryLampHeightM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLampHeightsM: [0.5, 1, 1.5],
  matchedObservedPpfd: [400, 200, 100],
  queryLampHeightM: 1.25,
} satisfies Input;
export const exampleOutput = { interpolatedMatchedPpfd: 150 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/hanging-height-ppfd-decay",
  title: "Hanging Height PPFD Decay Calculator",
  description:
    "Read actual matched grow-light height/PPFD calibration within observed range; no assumed inverse-square point source, extrapolation or plant-distance recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedMatchedPpfd",
      label: "Interpolated matched ppfd",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLampHeightsM: value.observedLampHeightsM as readonly number[],
      matchedObservedPpfd: value.matchedObservedPpfd as readonly number[],
      queryLampHeightM: value.queryLampHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
