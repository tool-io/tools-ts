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
          "Pindaric epinicians connect victory, praise, myth and reflective counsel with flexible composition.",
        reference: "Pindar, Olympian/Pythian/Nemean/Isthmian odes.",
        limitations:
          "No universal fixed section order or automatic victory-ode recognition from one motif.",
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
      text: "Pindaric epinicians connect victory, praise, myth and reflective counsel with flexible composition.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pindar-epinician-victory-ode-structure-lookup",
  title: "Pindar Epinician Victory Ode Structure Lookup",
  description:
    "Bounded offline reference: Pindaric epinicians connect victory, praise, myth and reflective counsel with flexible composition. Source: Pindar, Olympian/Pythian/Nemean/Isthmian odes. No universal fixed section order or automatic victory-ode recognition from one motif. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
