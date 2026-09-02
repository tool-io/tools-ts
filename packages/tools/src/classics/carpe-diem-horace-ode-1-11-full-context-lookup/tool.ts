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
          "Horace, Odes 1.11 addresses Leuconoe, rejects calculating allotted time, and closes carpe diem, quam minimum credula postero.",
        reference: "Horace, Carmina 1.11.",
        limitations:
          "Context reference includes poem identity and final clause, not a full modern copyrighted translation; no reckless-living prescription.",
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
      text: "Horace, Odes 1.11 addresses Leuconoe, rejects calculating allotted time, and closes carpe diem, quam minimum credula postero.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/carpe-diem-horace-ode-1-11-full-context-lookup",
  title: "Carpe Diem Horace Ode 1 11 Full Context Lookup",
  description:
    "Offline bounded reference card: Horace, Odes 1.11 addresses Leuconoe, rejects calculating allotted time, and closes carpe diem, quam minimum credula postero. References Horace, Carmina 1.11. Context reference includes poem identity and final clause, not a full modern copyrighted translation; no reckless-living prescription.",
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
