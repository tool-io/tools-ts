import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
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
          "Open skills occur in changing externally influenced environments; closed skills occur in relatively stable predictable task contexts.",
        reference: "Motor learning skill taxonomy literature.",
        limitations:
          "Tasks can combine characteristics; classification is not a ranking of difficulty or performer ability.",
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
      text: "Open skills occur in changing externally influenced environments; closed skills occur in relatively stable predictable task contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/open-vs-closed-skill-environment-taxonomy-lookup",
  title: "Open vs Closed Skill Environment Taxonomy Lookup",
  description:
    "Bounded offline reference: Open skills occur in changing externally influenced environments; closed skills occur in relatively stable predictable task contexts. Source: Motor learning skill taxonomy literature. Tasks can combine characteristics; classification is not a ranking of difficulty or performer ability. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
