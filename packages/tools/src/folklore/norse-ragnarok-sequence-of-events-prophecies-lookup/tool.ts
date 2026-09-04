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
          "V\u00f6lusp\u00e1 presents Ragnarok imagery including cosmic conflict, destruction and renewal; transmitted accounts differ.",
        reference: "Poetic Edda, V\u00f6lusp\u00e1; Prose Edda, Gylfaginning.",
        limitations:
          "A limited source summary, not a single authoritative chronological prophecy or prediction.",
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
      text: "V\u00f6lusp\u00e1 presents Ragnarok imagery including cosmic conflict, destruction and renewal; transmitted accounts differ.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/norse-ragnarok-sequence-of-events-prophecies-lookup",
  title: "Norse Ragnarok Sequence of Events Prophecies Lookup",
  description:
    "Bounded offline reference: V\u00f6lusp\u00e1 presents Ragnarok imagery including cosmic conflict, destruction and renewal; transmitted accounts differ. Source: Poetic Edda, V\u00f6lusp\u00e1; Prose Edda, Gylfaginning. A limited source summary, not a single authoritative chronological prophecy or prediction. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
