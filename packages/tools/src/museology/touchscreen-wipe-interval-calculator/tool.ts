import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly dailyTouchInteractions: number;
  readonly callerMaximumInteractionsBetweenWipes: number;
  readonly priorInteractionsSinceWipe: number;
}>;
export type Output = Readonly<{
  readonly minimumWholeWipesDueDuringDay: number;
  readonly interactionsCarriedAfterWipes: number;
}>;
const inputFields = [
  {
    id: "dailyTouchInteractions",
    label: "Daily touch interactions",
    kind: "integer",
  },
  {
    id: "callerMaximumInteractionsBetweenWipes",
    label: "Caller maximum interactions between wipes",
    kind: "integer",
  },
  {
    id: "priorInteractionsSinceWipe",
    label: "Prior interactions since wipe",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumInteractionsBetweenWipes,
    "callerMaximumInteractionsBetweenWipes",
  );
  count(input.dailyTouchInteractions, "dailyTouchInteractions");
  count(
    input.callerMaximumInteractionsBetweenWipes,
    "callerMaximumInteractionsBetweenWipes",
  );
  count(input.priorInteractionsSinceWipe, "priorInteractionsSinceWipe");
  if (
    input.priorInteractionsSinceWipe >=
    input.callerMaximumInteractionsBetweenWipes
  )
    simpleError("prior", "Prior carry must be below caller interval.");
  const total = count(
      input.dailyTouchInteractions + input.priorInteractionsSinceWipe,
      "interactions",
    ),
    n = Math.floor(total / input.callerMaximumInteractionsBetweenWipes);
  return {
    minimumWholeWipesDueDuringDay: n,
    interactionsCarriedAfterWipes:
      total - n * input.callerMaximumInteractionsBetweenWipes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyTouchInteractions: 1000,
  callerMaximumInteractionsBetweenWipes: 200,
  priorInteractionsSinceWipe: 50,
} satisfies Input;
export const exampleOutput = {
  minimumWholeWipesDueDuringDay: 5,
  interactionsCarriedAfterWipes: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/touchscreen-wipe-interval-calculator",
  title: "Touchscreen Sanitation Wipe Interval Visitor Volume Calculator",
  description:
    "Count caller interaction-based wipe events with carried exposure rather than visits assumed to touch once; no disinfectant, infection prevention or sanitation efficacy advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumWholeWipesDueDuringDay",
      label: "Minimum whole wipes due during day",
      kind: "number",
    },
    {
      id: "interactionsCarriedAfterWipes",
      label: "Interactions carried after wipes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyTouchInteractions: value.dailyTouchInteractions as number,
      callerMaximumInteractionsBetweenWipes:
        value.callerMaximumInteractionsBetweenWipes as number,
      priorInteractionsSinceWipe: value.priorInteractionsSinceWipe as number,
    }),
});
export const run = tool.execute;
export default tool;
