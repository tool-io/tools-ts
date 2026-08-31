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
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly potImmediatelyBeforeCall: number;
  readonly amountToCall: number;
  readonly callerWinProbability: number;
  readonly callerTieProbability: number;
  readonly callerNetPotRake: number;
}>;
export type Output = Readonly<{
  readonly netCallEv: number;
  readonly positiveCallEv: boolean;
  readonly netFoldEvBaseline: number;
}>;
const inputFields = [
  {
    id: "potImmediatelyBeforeCall",
    label: "Pot immediately before call",
    kind: "number",
  },
  { id: "amountToCall", label: "Amount to call", kind: "number" },
  {
    id: "callerWinProbability",
    label: "Caller win probability",
    kind: "number",
  },
  {
    id: "callerTieProbability",
    label: "Caller tie probability",
    kind: "number",
  },
  { id: "callerNetPotRake", label: "Caller net pot rake", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.amountToCall, "amountToCall");
  nonnegative(input.potImmediatelyBeforeCall, "potImmediatelyBeforeCall");
  nonnegative(input.callerNetPotRake, "callerNetPotRake");
  fraction(input.callerWinProbability, "callerWinProbability");
  fraction(input.callerTieProbability, "callerTieProbability");
  if (
    input.callerWinProbability + input.callerTieProbability > 1 ||
    input.callerNetPotRake > input.potImmediatelyBeforeCall + input.amountToCall
  )
    simpleError(
      "probabilities",
      "Exclusive win/tie probabilities and feasible final-pot rake required.",
    );
  const pot =
      input.potImmediatelyBeforeCall +
      input.amountToCall -
      input.callerNetPotRake,
    ev =
      (input.callerWinProbability + 0.5 * input.callerTieProbability) * pot -
      input.amountToCall;
  return { netCallEv: ev, positiveCallEv: ev > 0, netFoldEvBaseline: 0 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  potImmediatelyBeforeCall: 150,
  amountToCall: 50,
  callerWinProbability: 0.4,
  callerTieProbability: 0.1,
  callerNetPotRake: 0,
} satisfies Input;
export const exampleOutput = {
  netCallEv: 40,
  positiveCallEv: true,
  netFoldEvBaseline: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/poker-ev-call-positive-checker",
  title: "Call EV Positive Checker",
  description:
    "Compute caller heads-up call EV with exclusive win/tie probabilities, split tied pot and final-pot rake; current decision cost relative to fold, no future betting/side pots or promised outcome.",
  inputs: inputFields,
  outputs: [
    { id: "netCallEv", label: "Net call ev", kind: "number" },
    { id: "positiveCallEv", label: "Positive call ev", kind: "boolean" },
    { id: "netFoldEvBaseline", label: "Net fold ev baseline", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      potImmediatelyBeforeCall: value.potImmediatelyBeforeCall as number,
      amountToCall: value.amountToCall as number,
      callerWinProbability: value.callerWinProbability as number,
      callerTieProbability: value.callerTieProbability as number,
      callerNetPotRake: value.callerNetPotRake as number,
    }),
});
export const run = tool.execute;
export default tool;
