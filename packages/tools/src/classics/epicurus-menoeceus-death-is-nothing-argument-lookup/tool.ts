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
          "Epicurus argues that death is nothing to us because good and evil depend on sensation and death is deprivation of sensation.",
        reference: "Epicurus, Letter to Menoeceus124\u2013125.",
        limitations:
          "A philosophical argument, not proof against grief or a substitute for mental-health/crisis care.",
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
      text: "Epicurus argues that death is nothing to us because good and evil depend on sensation and death is deprivation of sensation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/epicurus-menoeceus-death-is-nothing-argument-lookup",
  title: "Epicurus Menoeceus Death Is Nothing Argument Lookup",
  description:
    "Bounded offline reference: Epicurus argues that death is nothing to us because good and evil depend on sensation and death is deprivation of sensation. Source: Epicurus, Letter to Menoeceus124\u2013125. A philosophical argument, not proof against grief or a substitute for mental-health/crisis care. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
