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
          "The informal first triumvirate joined Caesar, Pompey and Crassus around 60 BCE; the legally constituted second joined Octavian, Antony and Lepidus in 43 BCE.",
        reference: "Suetonius, Divus Julius19; Appian, Civil Wars 4.",
        limitations:
          "Terms, duration and power relations differ; approximate first-arrangement date is not a legal foundation date.",
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
      text: "The informal first triumvirate joined Caesar, Pompey and Crassus around 60 BCE; the legally constituted second joined Octavian, Antony and Lepidus in 43 BCE.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/triumvirate-first-second-members-dates-lookup",
  title: "Triumvirate First Second Members Dates Lookup",
  description:
    "Offline bounded reference card: The informal first triumvirate joined Caesar, Pompey and Crassus around 60 BCE; the legally constituted second joined Octavian, Antony and Lepidus in 43 BCE. References Suetonius, Divus Julius19; Appian, Civil Wars 4. Terms, duration and power relations differ; approximate first-arrangement date is not a legal foundation date.",
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
