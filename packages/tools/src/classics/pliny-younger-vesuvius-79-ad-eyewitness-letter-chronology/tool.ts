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
          "Pliny the Younger, Letters 6.16 and 6.20 describes his uncle and his own experience of the 79 CE Vesuvius eruption.",
        reference: "Pliny, Epistulae 6.16,6.20.",
        limitations:
          "Exact eruption date and manuscript readings are debated; chronology needs edition and archaeology.",
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
      text: "Pliny the Younger, Letters 6.16 and 6.20 describes his uncle and his own experience of the 79 CE Vesuvius eruption.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pliny-younger-vesuvius-79-ad-eyewitness-letter-chronology",
  title: "Pliny Younger Vesuvius 79 AD Eyewitness Letter Chronology",
  description:
    "Offline bounded reference card: Pliny the Younger, Letters 6.16 and 6.20 describes his uncle and his own experience of the 79 CE Vesuvius eruption. References Pliny, Epistulae 6.16,6.20. Exact eruption date and manuscript readings are debated; chronology needs edition and archaeology.",
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
