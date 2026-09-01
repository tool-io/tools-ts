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
          "Danto emphasizes interpretation and historically situated artworld theory; Dickie emphasizes institutional relations and presentation.",
        reference:
          "Danto, The Artworld 1964; Dickie, Art and the Aesthetic 1974.",
        limitations:
          "The accounts evolve and are not interchangeable art-quality tests.",
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
      text: "Danto emphasizes interpretation and historically situated artworld theory; Dickie emphasizes institutional relations and presentation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/danto-vs-dickie-definition-crosswalk-compare",
  title: "Danto vs Dickie Definition Crosswalk Compare",
  description:
    "Bounded offline reference: Danto emphasizes interpretation and historically situated artworld theory; Dickie emphasizes institutional relations and presentation. Source: Danto, The Artworld 1964; Dickie, Art and the Aesthetic 1974. The accounts evolve and are not interchangeable art-quality tests. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
