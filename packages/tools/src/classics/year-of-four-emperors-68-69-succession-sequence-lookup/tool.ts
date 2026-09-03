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
          "The conventional 69 CE sequence is Galba, Otho, Vitellius and Vespasian; Nero's death in 68 CE belongs to its prelude.",
        reference: "Tacitus, Histories; Suetonius imperial biographies.",
        limitations:
          "Civil-war recognition and regional control overlap; not four clean globally exclusive year intervals.",
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
      text: "The conventional 69 CE sequence is Galba, Otho, Vitellius and Vespasian; Nero's death in 68 CE belongs to its prelude.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/year-of-four-emperors-68-69-succession-sequence-lookup",
  title: "Year of Four Emperors68/69 Succession Sequence Lookup",
  description:
    "Bounded offline reference: The conventional 69 CE sequence is Galba, Otho, Vitellius and Vespasian; Nero's death in 68 CE belongs to its prelude. Source: Tacitus, Histories; Suetonius imperial biographies. Civil-war recognition and regional control overlap; not four clean globally exclusive year intervals. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
