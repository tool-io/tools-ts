import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualCorrectResponseFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCorrectResponseFraction",
    label: "Actual correct response fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(
    input.actualCorrectResponseFraction,
    "actualCorrectResponseFraction",
  );
  if (
    input.actualCorrectResponseFraction <= 0 ||
    input.actualCorrectResponseFraction >= 1
  )
    simpleError("fraction", "FiniteinteriorRaschlogit.");
  return {
    value: Math.log(
      (1 - input.actualCorrectResponseFraction) /
        input.actualCorrectResponseFraction,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCorrectResponseFraction: 0.5 },
  output: { result: { value: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/rasch-item-difficulty-logits",
  title: "Rasch Item Difficulty Logits Calculator",
  description:
    "Restricted centeredRaschitemdifficulty\u2212logit(p), actual homogeneous ability zero reference assumption,0<p<1. Not jointly estimated item difficulty/person ability or actual calibratedRaschfit. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
