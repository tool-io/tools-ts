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
          "NATOAllied Command Transformation undertakes strategic foresight; NATO Futures Command is not its standard institutional name.",
        reference: "NATOACT, Strategic Foresight Analysis publications.",
        limitations:
          "Correct institution; not classified planning, current threat assessment or official strategy advice.",
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
      text: "NATOAllied Command Transformation undertakes strategic foresight; NATO Futures Command is not its standard institutional name.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/nato-futures-command-strategic-concept-horizon-scan",
  title: "NATO Futures Command Strategic Concept Horizon Scan",
  description:
    "Bounded offline reference: NATOAllied Command Transformation undertakes strategic foresight; NATO Futures Command is not its standard institutional name. Source: NATOACT, Strategic Foresight Analysis publications. Correct institution; not classified planning, current threat assessment or official strategy advice. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
