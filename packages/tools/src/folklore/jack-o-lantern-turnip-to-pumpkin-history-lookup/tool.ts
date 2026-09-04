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
          "Carved turnip and other root lanterns occur in British/Irish traditions; North American Halloween practice prominently uses pumpkins.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore, Jack-o-lantern.",
        limitations:
          "No single securely established turnip-to-pumpkin invention date or universal origin is asserted.",
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
      text: "Carved turnip and other root lanterns occur in British/Irish traditions; North American Halloween practice prominently uses pumpkins.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/jack-o-lantern-turnip-to-pumpkin-history-lookup",
  title: "Jack O Lantern Turnip to Pumpkin History Lookup",
  description:
    "Bounded offline reference: Carved turnip and other root lanterns occur in British/Irish traditions; North American Halloween practice prominently uses pumpkins. Source: Simpson and Roud, A Dictionary of English Folklore, Jack-o-lantern. No single securely established turnip-to-pumpkin invention date or universal origin is asserted. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
