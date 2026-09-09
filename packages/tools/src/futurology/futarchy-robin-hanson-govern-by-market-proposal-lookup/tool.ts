import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Hansons futarchy proposes choosing values democratically and using prediction markets to inform conditional policy choices.",
        reference: "Hanson, futarchy proposal writings.",
        limitations:
          "Normative governance proposal, not demonstrated universal market accuracy or investment instructions.",
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
      text: "Hansons futarchy proposes choosing values democratically and using prediction markets to inform conditional policy choices.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/futarchy-robin-hanson-govern-by-market-proposal-lookup",
  title: "Futarchy Robin Hanson Govern By Market Proposal Lookup",
  description:
    "Bounded offline reference: Hansons futarchy proposes choosing values democratically and using prediction markets to inform conditional policy choices. Source: Hanson, futarchy proposal writings. Normative governance proposal, not demonstrated universal market accuracy or investment instructions. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
