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
          "Prompter boxes in some opera traditions position a prompter near the stage front below the performers sightline.",
        reference: "Opera stagecraft history.",
        limitations:
          "Venue layouts differ; no single universal understage position or access/egress approval.",
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
      text: "Prompter boxes in some opera traditions position a prompter near the stage front below the performers sightline.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/prompter-box-understage-position-opera-tradition-lookup",
  title: "Prompter Box Understage Position Opera Tradition Lookup",
  description:
    "Bounded offline reference: Prompter boxes in some opera traditions position a prompter near the stage front below the performers sightline. Source: Opera stagecraft history. Venue layouts differ; no single universal understage position or access/egress approval. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
