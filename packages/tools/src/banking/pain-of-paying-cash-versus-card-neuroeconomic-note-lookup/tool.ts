import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Pain-of-paying research studies how payment salience and timing can affect spending experiences.",
        reference: "Prelec and Loewenstein 1998; consumer payment research.",
        limitations:
          "Cash/card effects depend on cohort/task; not a universal neurobiological spending prediction.",
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
      text: "Pain-of-paying research studies how payment salience and timing can affect spending experiences.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/pain-of-paying-cash-versus-card-neuroeconomic-note-lookup",
  title: "Pain of Paying Cash Versus Card Neuroeconomic Note Lookup",
  description:
    "Bounded offline reference: Pain-of-paying research studies how payment salience and timing can affect spending experiences. Source: Prelec and Loewenstein 1998; consumer payment research. Cash/card effects depend on cohort/task; not a universal neurobiological spending prediction. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
