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
          "Dunne and Rabys speculative design uses objects/scenarios to question assumptions and discuss alternative futures rather than only optimize current products.",
        reference: "Dunneand Raby, Speculative Everything 2013.",
        limitations:
          "Provocation is not tested functionality, forecast accuracy or community consent.",
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
      text: "Dunne and Rabys speculative design uses objects/scenarios to question assumptions and discuss alternative futures rather than only optimize current products.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/speculative-design-dunne-raby-critical-objects-method",
  title: "Speculative Design Dunne Raby Critical Objects Method",
  description:
    "Bounded offline reference: Dunne and Rabys speculative design uses objects/scenarios to question assumptions and discuss alternative futures rather than only optimize current products. Source: Dunneand Raby, Speculative Everything 2013. Provocation is not tested functionality, forecast accuracy or community consent. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
