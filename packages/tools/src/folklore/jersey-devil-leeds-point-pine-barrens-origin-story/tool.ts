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
          "Jersey Devil stories connect Pine Barrens/Leeds-family narratives with later print and popular elaboration.",
        reference:
          "Regal and Esposito, The Secret History of the Jersey Devil.",
        limitations:
          "No verified monster, birth curse or single unchanging original tale.",
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
      text: "Jersey Devil stories connect Pine Barrens/Leeds-family narratives with later print and popular elaboration.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/jersey-devil-leeds-point-pine-barrens-origin-story",
  title: "Jersey Devil Leeds Point Pine Barrens Origin Story",
  description:
    "Bounded offline reference: Jersey Devil stories connect Pine Barrens/Leeds-family narratives with later print and popular elaboration. Source: Regal and Esposito, The Secret History of the Jersey Devil. No verified monster, birth curse or single unchanging original tale. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
