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
          "Moretum in the Appendix Vergiliana describes a rustic cheese/herb preparation within a literary scene.",
        reference: "Appendix Vergiliana, Moretum.",
        limitations:
          "Attribution to Vergil is not secure; literary preparation is not a modern food-safe recipe or universal Roman diet.",
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
      text: "Moretum in the Appendix Vergiliana describes a rustic cheese/herb preparation within a literary scene.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/moretum-cheese-herb-spread-pseudo-vergil-poem-lookup",
  title: "Moretum Cheese Herb Spread Pseudo Vergil Poem Lookup",
  description:
    "Bounded offline reference: Moretum in the Appendix Vergiliana describes a rustic cheese/herb preparation within a literary scene. Source: Appendix Vergiliana, Moretum. Attribution to Vergil is not secure; literary preparation is not a modern food-safe recipe or universal Roman diet. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
