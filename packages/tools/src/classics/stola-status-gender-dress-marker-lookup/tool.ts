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
          "Stola is associated in Roman literary conventions with the respectable matron, but archaeological identification and actual wearing practice are complex.",
        reference:
          "Roman literary dress evidence; Olson, Dress and the Roman Woman.",
        limitations:
          "Garment alone does not establish gender, marital status, citizenship or moral character.",
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
      text: "Stola is associated in Roman literary conventions with the respectable matron, but archaeological identification and actual wearing practice are complex.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/stola-status-gender-dress-marker-lookup",
  title: "Stola Status Gender Dress Marker Lookup",
  description:
    "Offline bounded reference card: Stola is associated in Roman literary conventions with the respectable matron, but archaeological identification and actual wearing practice are complex. References Roman literary dress evidence; Olson, Dress and the Roman Woman. Garment alone does not establish gender, marital status, citizenship or moral character.",
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
