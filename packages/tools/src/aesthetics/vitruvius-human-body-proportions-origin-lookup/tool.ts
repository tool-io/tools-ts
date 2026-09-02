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
          "Vitruvius discusses proportional human-body relations and geometric inscription within architectural reasoning.",
        reference: "Vitruvius, De architectura 3.1.",
        limitations:
          "Historical reference, not a universal anatomical norm or medical assessment.",
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
      text: "Vitruvius discusses proportional human-body relations and geometric inscription within architectural reasoning.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/vitruvius-human-body-proportions-origin-lookup",
  title: "Vitruvius Human Body Proportions Origin Lookup",
  description:
    "Bounded offline reference: Vitruvius discusses proportional human-body relations and geometric inscription within architectural reasoning. Source: Vitruvius, De architectura 3.1. Historical reference, not a universal anatomical norm or medical assessment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
