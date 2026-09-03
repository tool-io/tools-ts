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
          "A traditional account divides thirty years of Vestal service into ten learning, ten performing and ten teaching years.",
        reference: "Plutarch, Numa 10.",
        limitations:
          "Normative literary account, not a complete individual service record or every historical exception.",
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
      text: "A traditional account divides thirty years of Vestal service into ten learning, ten performing and ten teaching years.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/vestal-virgins-thirty-year-service-stages-lookup",
  title: "Vestal Virgins Thirty Year Service Stages Lookup",
  description:
    "Offline bounded reference card: A traditional account divides thirty years of Vestal service into ten learning, ten performing and ten teaching years. References Plutarch, Numa 10. Normative literary account, not a complete individual service record or every historical exception.",
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
