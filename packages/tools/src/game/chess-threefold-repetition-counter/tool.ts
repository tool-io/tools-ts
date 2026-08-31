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
  fen,
  repetitionKey,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedPositionFens: readonly string[];
}>;
export type Output = Readonly<{
  readonly finalPositionOccurrenceCount: number;
  readonly threefoldClaimCandidate: boolean;
  readonly fivefoldAutomaticDrawCandidate: boolean;
}>;
const inputFields = [
  {
    id: "observedPositionFens",
    label: "Observed position fens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.observedPositionFens.length)
    simpleError("positions", "Nonempty bounded observed history required.");
  const keys = input.observedPositionFens.map((s) => repetitionKey(fen(s))),
    last = keys[keys.length - 1],
    n = keys.filter((k) => k === last).length;
  return {
    finalPositionOccurrenceCount: n,
    threefoldClaimCandidate: n >= 3,
    fivefoldAutomaticDrawCandidate: n >= 5,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPositionFens: [
    "4k3/8/8/8/8/8/8/4K3 w - - 0 1",
    "4k3/8/8/8/8/8/8/4K3 w - - 4 3",
    "4k3/8/8/8/8/8/8/4K3 w - - 8 5",
  ],
} satisfies Input;
export const exampleOutput = {
  finalPositionOccurrenceCount: 3,
  threefoldClaimCandidate: true,
  fivefoldAutomaticDrawCandidate: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/chess-threefold-repetition-counter",
  title: "Threefold Repetition Counter",
  description:
    "Count observed final-position repetitions by placement, side, rights and only legally capturable en-passant; counters ignored. Caller history adjacency/completeness and checkmate/claim procedure are not certified.",
  inputs: inputFields,
  outputs: [
    {
      id: "finalPositionOccurrenceCount",
      label: "Final position occurrence count",
      kind: "number",
    },
    {
      id: "threefoldClaimCandidate",
      label: "Threefold claim candidate",
      kind: "boolean",
    },
    {
      id: "fivefoldAutomaticDrawCandidate",
      label: "Fivefold automatic draw candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPositionFens: value.observedPositionFens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
