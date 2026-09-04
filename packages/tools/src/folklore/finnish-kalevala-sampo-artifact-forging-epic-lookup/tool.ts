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
          "In the Kalevala, Ilmarinen forges the Sampo, a wondrous object whose identity and significance have multiple interpretations.",
        reference: "L\u00f6nnrot, Kalevala, notably runos10,42\u201343.",
        limitations:
          "Published epic construction and earlier oral variants differ; no one settled historical artifact identity.",
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
      text: "In the Kalevala, Ilmarinen forges the Sampo, a wondrous object whose identity and significance have multiple interpretations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/finnish-kalevala-sampo-artifact-forging-epic-lookup",
  title: "Finnish Kalevala Sampo Artifact Forging Epic Lookup",
  description:
    "Bounded offline reference: In the Kalevala, Ilmarinen forges the Sampo, a wondrous object whose identity and significance have multiple interpretations. Source: L\u00f6nnrot, Kalevala, notably runos10,42\u201343. Published epic construction and earlier oral variants differ; no one settled historical artifact identity. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
