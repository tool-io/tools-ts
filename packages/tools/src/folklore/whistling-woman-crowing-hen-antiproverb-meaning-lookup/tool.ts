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
          "Whistling-woman/crowing-hen sayings historically police gendered behavior in some communities.",
        reference: "Proverb and gender folklore scholarship.",
        limitations:
          "Description is not endorsement of misogyny or evidence that behavior causes bad luck.",
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
      text: "Whistling-woman/crowing-hen sayings historically police gendered behavior in some communities.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/whistling-woman-crowing-hen-antiproverb-meaning-lookup",
  title: "Whistling Woman Crowing Hen Antiproverb Meaning Lookup",
  description:
    "Bounded offline reference: Whistling-woman/crowing-hen sayings historically police gendered behavior in some communities. Source: Proverb and gender folklore scholarship. Description is not endorsement of misogyny or evidence that behavior causes bad luck. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
