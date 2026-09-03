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
          "Suetonius, Caligula55reports proposed honors for Incitatus and says he was said to intend a consulship; it does not establish an actual horse senator appointment.",
        reference: "Suetonius, Caligula55; Cassius Dio 59.14.",
        limitations:
          "Hostile-source anecdotes require qualification; no proven completed consulship or senatorial office.",
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
      text: "Suetonius, Caligula55reports proposed honors for Incitatus and says he was said to intend a consulship; it does not establish an actual horse senator appointment.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/incitatus-horse-senator-primary-source-verdict-lookup",
  title: "Incitatus Horse Senator Primary Source Verdict Lookup",
  description:
    "Offline bounded reference card: Suetonius, Caligula55reports proposed honors for Incitatus and says he was said to intend a consulship; it does not establish an actual horse senator appointment. References Suetonius, Caligula55; Cassius Dio 59.14. Hostile-source anecdotes require qualification; no proven completed consulship or senatorial office.",
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
