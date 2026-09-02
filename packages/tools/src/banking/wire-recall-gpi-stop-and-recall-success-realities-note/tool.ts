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
          "Wire recall/stop requests do not by themselves reverse a completed transfer or guarantee recovery.",
        reference:
          "SWIFT, gpi stop-and-recall documentation; bank fraud-recovery guidance.",
        limitations:
          "Act promptly through trusted bank channels; verified settlement, beneficiary consent and legal powers govern outcomes.",
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
      text: "Wire recall/stop requests do not by themselves reverse a completed transfer or guarantee recovery.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/wire-recall-gpi-stop-and-recall-success-realities-note",
  title: "Wire Recall Gpi Stop and Recall Success Realities Note",
  description:
    "Bounded offline reference: Wire recall/stop requests do not by themselves reverse a completed transfer or guarantee recovery. Source: SWIFT, gpi stop-and-recall documentation; bank fraud-recovery guidance. Act promptly through trusted bank channels; verified settlement, beneficiary consent and legal powers govern outcomes. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
