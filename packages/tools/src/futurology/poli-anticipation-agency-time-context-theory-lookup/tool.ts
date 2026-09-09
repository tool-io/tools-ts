import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Polis anticipation studies examine how present action uses ideas/models of future possibilities, across systems and contexts.",
        reference: "Poli, Introduction to Anticipation 2017.",
        limitations:
          "Conceptual reference, not one universal agency score or forecast algorithm.",
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
      text: "Polis anticipation studies examine how present action uses ideas/models of future possibilities, across systems and contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/poli-anticipation-agency-time-context-theory-lookup",
  title: "Poli Anticipation Agency Time Context Theory Lookup",
  description:
    "Bounded offline reference: Polis anticipation studies examine how present action uses ideas/models of future possibilities, across systems and contexts. Source: Poli, Introduction to Anticipation 2017. Conceptual reference, not one universal agency score or forecast algorithm. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
