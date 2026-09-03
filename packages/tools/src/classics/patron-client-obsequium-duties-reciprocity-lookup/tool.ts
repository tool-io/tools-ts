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
          "Roman patron-client relations could involve protection, representation, services, attendance and reciprocal obligations.",
        reference: "Dionysius of Halicarnassus, Roman Antiquities 2.10.",
        limitations:
          "Evidence and status differ; not a single timeless enforceable duties checklist.",
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
      text: "Roman patron-client relations could involve protection, representation, services, attendance and reciprocal obligations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/patron-client-obsequium-duties-reciprocity-lookup",
  title: "Patron Client Obsequium Duties Reciprocity Lookup",
  description:
    "Offline bounded reference card: Roman patron-client relations could involve protection, representation, services, attendance and reciprocal obligations. References Dionysius of Halicarnassus, Roman Antiquities 2.10. Evidence and status differ; not a single timeless enforceable duties checklist.",
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
