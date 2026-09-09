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
          "Growth plates are developing structures with context-dependent vulnerability; unsafe heavy lifting can cause injury without proving all resistance training harms growth.",
        reference: "Pediatric sports medicine literature.",
        limitations: "No load limit or clinical injury assessment is inferred.",
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
      text: "Growth plates are developing structures with context-dependent vulnerability; unsafe heavy lifting can cause injury without proving all resistance training harms growth.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/growth-plate-physis-heavy-lifting-context-note-lookup",
  title: "Growth Plate Physis Heavy Lifting Context Note Lookup",
  description:
    "Bounded offline reference: Growth plates are developing structures with context-dependent vulnerability; unsafe heavy lifting can cause injury without proving all resistance training harms growth. Source: Pediatric sports medicine literature. No load limit or clinical injury assessment is inferred. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
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
