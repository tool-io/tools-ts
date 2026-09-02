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
          "The 1933 Banking Act included banking-separation provisions;1999 GLBA repealed specified affiliation restrictions, not every 1933 provision.",
        reference: "Banking Act 1933; Gramm-Leach-Bliley Act 1999.",
        limitations:
          "A repeal-all narrative is inaccurate; no proof the change alone caused a later crisis.",
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
      text: "The 1933 Banking Act included banking-separation provisions;1999 GLBA repealed specified affiliation restrictions, not every 1933 provision.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/glass-steagall-1933-repeal-1999-glba-timeline-lookup",
  title: "Glass Steagall 1933 Repeal 1999 Glba Timeline Lookup",
  description:
    "Bounded offline reference: The 1933 Banking Act included banking-separation provisions;1999 GLBA repealed specified affiliation restrictions, not every 1933 provision. Source: Banking Act 1933; Gramm-Leach-Bliley Act 1999. A repeal-all narrative is inaccurate; no proof the change alone caused a later crisis. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
