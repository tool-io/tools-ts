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
          "Suetonius attributes alea iacta est to Caesars Rubicon crossing; Plutarch preserves a Greek phrasing tradition.",
        reference: "Suetonius, Julius32; Plutarch, Caesar 32.",
        limitations:
          "Later textual witnesses are not a contemporary recording or uniquely certain original wording.",
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
      text: "Suetonius attributes alea iacta est to Caesars Rubicon crossing; Plutarch preserves a Greek phrasing tradition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/rubicon-alea-iacta-est-suetonius-quote-origin-lookup",
  title: "Rubicon Alea Iacta Est Suetonius Quote Origin Lookup",
  description:
    "Bounded offline reference: Suetonius attributes alea iacta est to Caesars Rubicon crossing; Plutarch preserves a Greek phrasing tradition. Source: Suetonius, Julius32; Plutarch, Caesar 32. Later textual witnesses are not a contemporary recording or uniquely certain original wording. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
