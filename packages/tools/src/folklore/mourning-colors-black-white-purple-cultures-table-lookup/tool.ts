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
          "Mourning colours have culture, community, era and role-specific meanings; black/white/purple are not a universal lookup by nationality alone.",
        reference: "Dress and mourning-history scholarship.",
        limitations:
          "Do not infer grief, religion or cultural identity from clothing colour alone.",
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
      text: "Mourning colours have culture, community, era and role-specific meanings; black/white/purple are not a universal lookup by nationality alone.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/mourning-colors-black-white-purple-cultures-table-lookup",
  title: "Mourning Colors Black White Purple Cultures Table Lookup",
  description:
    "Bounded offline reference: Mourning colours have culture, community, era and role-specific meanings; black/white/purple are not a universal lookup by nationality alone. Source: Dress and mourning-history scholarship. Do not infer grief, religion or cultural identity from clothing colour alone. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
