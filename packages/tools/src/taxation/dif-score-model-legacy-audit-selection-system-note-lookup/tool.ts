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
          "DIF refers to discriminant-function scoring used in tax-return examination selection alongside other processes.",
        reference: "IRS, examination selection descriptions.",
        limitations:
          "No secret model weights, audit probability or evasion recipe fabricated; a score alone is not evidence of wrongdoing.",
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
      text: "DIF refers to discriminant-function scoring used in tax-return examination selection alongside other processes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/dif-score-model-legacy-audit-selection-system-note-lookup",
  title: "Dif Score Model Legacy Audit Selection System Note Lookup",
  description:
    "Bounded offline reference: DIF refers to discriminant-function scoring used in tax-return examination selection alongside other processes. Source: IRS, examination selection descriptions. No secret model weights, audit probability or evasion recipe fabricated; a score alone is not evidence of wrongdoing. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
