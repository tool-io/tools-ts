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
          "Tall tales exaggerate feats and scale, especially in occupational and frontier storytelling.",
        reference: "Dorson, American Folklore.",
        limitations:
          "Exaggeration genre does not establish real feats or erase Indigenous/occupational historical contexts.",
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
      text: "Tall tales exaggerate feats and scale, especially in occupational and frontier storytelling.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/tall-tale-frontier-hero-exaggeration-lookup",
  title: "Tall Tale Frontier Hero Exaggeration Lookup",
  description:
    "Bounded offline reference: Tall tales exaggerate feats and scale, especially in occupational and frontier storytelling. Source: Dorson, American Folklore. Exaggeration genre does not establish real feats or erase Indigenous/occupational historical contexts. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
