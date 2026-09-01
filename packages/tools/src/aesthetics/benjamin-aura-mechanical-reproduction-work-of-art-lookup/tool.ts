import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, unique, pick } from "../batch44-shared.js";

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
          "Benjamin connects aura with a works unique presence and discusses changes under technical reproduction.",
        reference:
          "Benjamin, The Work of Art in the Age of Its Technological Reproducibility.",
        limitations:
          "Versions and translations differ; not a literal measurable energy or automatic loss-of-value law.",
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
      text: "Benjamin connects aura with a works unique presence and discusses changes under technical reproduction.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/benjamin-aura-mechanical-reproduction-work-of-art-lookup",
  title: "Benjamin Aura Mechanical Reproduction Work of Art Lookup",
  description:
    "Bounded offline reference: Benjamin connects aura with a works unique presence and discusses changes under technical reproduction. Source: Benjamin, The Work of Art in the Age of Its Technological Reproducibility. Versions and translations differ; not a literal measurable energy or automatic loss-of-value law. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
