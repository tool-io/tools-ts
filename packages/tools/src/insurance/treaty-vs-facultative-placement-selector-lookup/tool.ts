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
          "Treaty reinsurance covers a defined portfolio/class under an agreement; facultative reinsurance concerns individually negotiated risks.",
        reference: "IAIS, reinsurance supervisory materials.",
        limitations:
          "Not a recommendation to place a risk or proof the contract covers every loss.",
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
      text: "Treaty reinsurance covers a defined portfolio/class under an agreement; facultative reinsurance concerns individually negotiated risks.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/treaty-vs-facultative-placement-selector-lookup",
  title: "Treaty vs Facultative Placement Selector Lookup",
  description:
    "Bounded offline reference: Treaty reinsurance covers a defined portfolio/class under an agreement; facultative reinsurance concerns individually negotiated risks. Source: IAIS, reinsurance supervisory materials. Not a recommendation to place a risk or proof the contract covers every loss. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
