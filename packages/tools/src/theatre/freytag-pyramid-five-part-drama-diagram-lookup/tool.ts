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
          "Freytags historical five-part model distinguishes introduction, rising movement, climax, falling movement and catastrophe in its studied dramatic traditions.",
        reference: "Freytag, Die Technik des Dramas 1863.",
        limitations:
          "Modern diagrams simplify it; not universal drama or guaranteed audience response.",
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
      text: "Freytags historical five-part model distinguishes introduction, rising movement, climax, falling movement and catastrophe in its studied dramatic traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/freytag-pyramid-five-part-drama-diagram-lookup",
  title: "Freytag Pyramid Five Part Drama Diagram Lookup",
  description:
    "Bounded offline reference: Freytags historical five-part model distinguishes introduction, rising movement, climax, falling movement and catastrophe in its studied dramatic traditions. Source: Freytag, Die Technik des Dramas 1863. Modern diagrams simplify it; not universal drama or guaranteed audience response. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
