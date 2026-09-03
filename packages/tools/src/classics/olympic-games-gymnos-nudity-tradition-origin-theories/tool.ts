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
          "Ancient Greek athletic nudity traditions have differing origin stories and practices across periods/events.",
        reference: "Thucydides 1.6; Pausanias; Greek athletic scholarship.",
        limitations:
          "Gymnosmeans naked, but no single fully proven inventor, date or universal nudity rule for all ancient sport.",
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
      text: "Ancient Greek athletic nudity traditions have differing origin stories and practices across periods/events.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/olympic-games-gymnos-nudity-tradition-origin-theories",
  title: "Olympic Games Gymnos Nudity Tradition Origin Theories",
  description:
    "Bounded offline reference: Ancient Greek athletic nudity traditions have differing origin stories and practices across periods/events. Source: Thucydides 1.6; Pausanias; Greek athletic scholarship. Gymnosmeans naked, but no single fully proven inventor, date or universal nudity rule for all ancient sport. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
