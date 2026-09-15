import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  exactLookup,
} from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      I: "double-stranded DNA",
      II: "single-stranded DNA",
      III: "double-stranded RNA",
      IV: "positive-sense single-stranded RNA",
      V: "negative-sense single-stranded RNA",
      VI: "single-stranded RNA with reverse transcription",
      VII: "double-stranded DNA with reverse transcription",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "I" },
  output: { result: { reference: "double-stranded DNA" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/baltimore-class-resolver",
  title: "Baltimore Class I-VII Assignment Resolver",
  description:
    "Decode Baltimore replication-genome classes I–VII; nucleic acid type alone does not establish reverse transcription. Bounded exact-key educational reference only; observations and applicability must be established independently.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
