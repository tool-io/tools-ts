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
          "Setup, confrontation and resolution form one common three-act explanatory model.",
        reference: "Dramatic/screenwriting structure literature.",
        limitations:
          "Not every drama has exactly these boundaries or three acts; no automatic text segmentation.",
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
      text: "Setup, confrontation and resolution form one common three-act explanatory model.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/three-act-setup-confrontation-resolution-structure-lookup",
  title: "Three Act Setup Confrontation Resolution Structure Lookup",
  description:
    "Bounded offline reference: Setup, confrontation and resolution form one common three-act explanatory model. Source: Dramatic/screenwriting structure literature. Not every drama has exactly these boundaries or three acts; no automatic text segmentation. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
