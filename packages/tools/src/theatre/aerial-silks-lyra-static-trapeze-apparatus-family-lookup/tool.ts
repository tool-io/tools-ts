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
          "Aerial silks, lyra/hoop and static trapeze are distinct apparatus families with materially different support/contact/control conditions.",
        reference: "Qualified aerial performance literature.",
        limitations:
          "No rigging, trick, load or training instructions; apparatus identity does not establish safe use.",
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
      text: "Aerial silks, lyra/hoop and static trapeze are distinct apparatus families with materially different support/contact/control conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/aerial-silks-lyra-static-trapeze-apparatus-family-lookup",
  title: "Aerial Silks Lyra Static Trapeze Apparatus Family Lookup",
  description:
    "Bounded offline reference: Aerial silks, lyra/hoop and static trapeze are distinct apparatus families with materially different support/contact/control conditions. Source: Qualified aerial performance literature. No rigging, trick, load or training instructions; apparatus identity does not establish safe use. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
