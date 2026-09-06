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
          "Orichalcum is associated with copper-zinc alloys in Roman imperial brass denominations, with composition changing over time.",
        reference: "Roman coin metallurgical scholarship.",
        limitations:
          "Colour alone does not establish alloy, mint, date or authenticity.",
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
      text: "Orichalcum is associated with copper-zinc alloys in Roman imperial brass denominations, with composition changing over time.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/orichalcum-sestertius-brass-era-shift-note-lookup",
  title: "Orichalcum Sestertius Brass Era Shift Note Lookup",
  description:
    "Bounded offline reference: Orichalcum is associated with copper-zinc alloys in Roman imperial brass denominations, with composition changing over time. Source: Roman coin metallurgical scholarship. Colour alone does not establish alloy, mint, date or authenticity. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
