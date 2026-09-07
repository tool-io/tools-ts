import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  tokenInventory,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly firstPhrase: string;
  readonly secondPhrase: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "firstPhrase", label: "First phrase", kind: "string" },
  { id: "secondPhrase", label: "Second phrase", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = tokenInventory(input.firstPhrase),
    b = tokenInventory(input.secondPhrase);
  if (a.length < 2 || b.length < 2)
    simpleError("phrase", "At least two exact lexical tokens in each phrase.");
  return {
    exactWordReversal:
      a.length === b.length && a.every((v, i) => v === b[b.length - 1 - i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { firstPhrase: "we shape", secondPhrase: "shape we" },
  output: { result: { exactWordReversal: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/antimetabole-reversal-repetition-checker",
  title: "Antimetabole Reversal Repetition Checker",
  description:
    "Compare exact lexical reversal across two supplied phrases; no semantic chiasmus or grammatical validity inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
