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
          "Vomitorium denotes a theatre/amphitheatre passage for crowd entry/exit, not a room designed for diners to vomit.",
        reference:
          "Late Latin architectural vocabulary; Macrobius, Saturnalia 6.4.3.",
        limitations:
          "Terminology alone does not certify a specific archaeological passage identification.",
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
      text: "Vomitorium denotes a theatre/amphitheatre passage for crowd entry/exit, not a room designed for diners to vomit.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/vomitorium-myth-exit-ramp-verdict-lookup",
  title: "Vomitorium Myth Exit Ramp Verdict Lookup",
  description:
    "Offline bounded reference card: Vomitorium denotes a theatre/amphitheatre passage for crowd entry/exit, not a room designed for diners to vomit. References Late Latin architectural vocabulary; Macrobius, Saturnalia 6.4.3. Terminology alone does not certify a specific archaeological passage identification.",
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
