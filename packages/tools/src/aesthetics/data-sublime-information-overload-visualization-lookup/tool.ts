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
          "Data-sublime discourse connects overwhelming information, scale and representational limits.",
        reference: "Contemporary visualization and sublime criticism.",
        limitations:
          "Large datasets or complex visuals do not automatically establish truth, beauty or comprehension.",
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
      text: "Data-sublime discourse connects overwhelming information, scale and representational limits.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/data-sublime-information-overload-visualization-lookup",
  title: "Data Sublime Information Overload Visualization Lookup",
  description:
    "Bounded offline reference: Data-sublime discourse connects overwhelming information, scale and representational limits. Source: Contemporary visualization and sublime criticism. Large datasets or complex visuals do not automatically establish truth, beauty or comprehension. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
