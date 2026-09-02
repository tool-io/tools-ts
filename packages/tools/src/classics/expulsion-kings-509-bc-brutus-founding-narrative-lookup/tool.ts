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
          "Roman tradition places expulsion of Tarquin and founding of the Republic in 509 BCE with Brutus central to the narrative.",
        reference: "Livy 1.59\u20132.1.",
        limitations:
          "Traditional chronology and later literary narrative are not independent contemporary proof of each event.",
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
      text: "Roman tradition places expulsion of Tarquin and founding of the Republic in 509 BCE with Brutus central to the narrative.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/expulsion-kings-509-bc-brutus-founding-narrative-lookup",
  title: "Expulsion Kings 509 BC Brutus Founding Narrative Lookup",
  description:
    "Offline bounded reference card: Roman tradition places expulsion of Tarquin and founding of the Republic in 509 BCE with Brutus central to the narrative. References Livy 1.59\u20132.1. Traditional chronology and later literary narrative are not independent contemporary proof of each event.",
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
