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
          "Claudius Roman invasion of Britain began in 43 CE under Aulus Plautius; Claudius joined a later ceremonial/military phase.",
        reference: "Cassius Dio 60.19\u201323; Suetonius, Claudius 17.",
        limitations:
          "Political rationale and conquest scope require source qualification; not conquest of every part of Britain in one year.",
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
      text: "Claudius Roman invasion of Britain began in 43 CE under Aulus Plautius; Claudius joined a later ceremonial/military phase.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/claudius-britannia-conquest-43-ad-rationale-lookup",
  title: "Claudius Britannia ConquestAD 43 Rationale Lookup",
  description:
    "Bounded offline reference: Claudius Roman invasion of Britain began in 43 CE under Aulus Plautius; Claudius joined a later ceremonial/military phase. Source: Cassius Dio 60.19\u201323; Suetonius, Claudius 17. Political rationale and conquest scope require source qualification; not conquest of every part of Britain in one year. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
