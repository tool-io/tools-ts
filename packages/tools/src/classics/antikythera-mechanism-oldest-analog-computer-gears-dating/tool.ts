import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "The Antikythera mechanism is a geared ancient astronomical device recovered from a shipwreck, commonly dated to the late Hellenistic period.",
        reference: "Antikythera Mechanism Research Project publications.",
        limitations:
          "Analog computer is a modern functional description; oldest-ever and exact dating require qualifications, not a complete global record audit.",
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
      text: "The Antikythera mechanism is a geared ancient astronomical device recovered from a shipwreck, commonly dated to the late Hellenistic period.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/antikythera-mechanism-oldest-analog-computer-gears-dating",
  title: "Antikythera Mechanism Oldest Analog Computer Gears Dating",
  description:
    "Bounded offline reference: The Antikythera mechanism is a geared ancient astronomical device recovered from a shipwreck, commonly dated to the late Hellenistic period. Source: Antikythera Mechanism Research Project publications. Analog computer is a modern functional description; oldest-ever and exact dating require qualifications, not a complete global record audit. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
