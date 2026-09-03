import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Ovid describes his relegation to Tomis through carmen et error, poem and mistake, without fully explaining the error.",
        reference: "Ovid, Tristia2; Epistulae ex Ponto.",
        limitations:
          "Modern cause hypotheses remain speculative; no fabricated certain secret or universal exile-law equivalence.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Ovid describes his relegation to Tomis through carmen et error, poem and mistake, without fully explaining the error.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/ovid-exile-tomis-cause-causa-scholarly-speculation-lookup",
  title: "Ovid Exile Tomis Cause Causa Scholarly Speculation Lookup",
  description:
    "Bounded offline reference: Ovid describes his relegation to Tomis through carmen et error, poem and mistake, without fully explaining the error. Source: Ovid, Tristia2; Epistulae ex Ponto. Modern cause hypotheses remain speculative; no fabricated certain secret or universal exile-law equivalence. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
