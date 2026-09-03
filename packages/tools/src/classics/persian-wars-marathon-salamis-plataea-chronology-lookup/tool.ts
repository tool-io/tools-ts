import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch43-shared.js";

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
          "Conventional Persian-War milestones include Marathon490 BCE, Salamis480 BCE, and Plataea479 BCE.",
        reference: "Herodotus, Histories6,8,9.",
        limitations:
          "These are nominal chronology anchors, not exact day conversions or a complete war timeline.",
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
      text: "Conventional Persian-War milestones include Marathon490 BCE, Salamis480 BCE, and Plataea479 BCE.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/persian-wars-marathon-salamis-plataea-chronology-lookup",
  title: "Persian Wars Marathon Salamis Plataea Chronology Lookup",
  description:
    "Offline bounded reference card: Conventional Persian-War milestones include Marathon490 BCE, Salamis480 BCE, and Plataea479 BCE. References Herodotus, Histories6,8,9. These are nominal chronology anchors, not exact day conversions or a complete war timeline.",
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
