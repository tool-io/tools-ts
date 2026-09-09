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
          "Simon argued that abundant information creates scarcity of attention and a need to allocate it efficiently.",
        reference:
          "Simon, Designing Organizations for an Information-Rich World 1971.",
        limitations:
          "Historical analytical claim, not a quantified forecast or universal productivity law.",
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
      text: "Simon argued that abundant information creates scarcity of attention and a need to allocate it efficiently.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/herbert-simon-attention-economy-prediction-lookup",
  title: "Herbert Simon Attention Economy Prediction Lookup",
  description:
    "Bounded offline reference: Simon argued that abundant information creates scarcity of attention and a need to allocate it efficiently. Source: Simon, Designing Organizations for an Information-Rich World 1971. Historical analytical claim, not a quantified forecast or universal productivity law. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
