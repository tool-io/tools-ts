import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sequence, pick } from "../batch44-shared.js";

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
          "Grimm's later Hansel and Gretel includes a duck-assisted water crossing and the oven reversal; variants differ.",
        reference: "Grimm, KHM15, edition comparison.",
        limitations:
          "Plot description only, no physical replication or universal folktale sequence.",
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
      text: "Grimm's later Hansel and Gretel includes a duck-assisted water crossing and the oven reversal; variants differ.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/hansel-gretel-duck-crossing-oven-push-variant-details",
  title: "Hansel Gretel Duck Crossing Oven Push Variant Details",
  description:
    "Bounded offline reference: Grimm's later Hansel and Gretel includes a duck-assisted water crossing and the oven reversal; variants differ. Source: Grimm, KHM15, edition comparison. Plot description only, no physical replication or universal folktale sequence. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
