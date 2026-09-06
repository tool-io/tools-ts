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
          "Wrong-planchet/off-metal errors require independently verified issue, weight, dimensions and composition with alternative causes excluded.",
        reference: "Mint-error catalogue and grading guidance.",
        limitations:
          "Appearance alone does not distinguish a genuine mint error from plating, damage or counterfeit.",
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
      text: "Wrong-planchet/off-metal errors require independently verified issue, weight, dimensions and composition with alternative causes excluded.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/off-metal-wrong-planchet-transitional-error-lookup",
  title: "Off Metal Wrong Planchet Transitional Error Lookup",
  description:
    "Bounded offline reference: Wrong-planchet/off-metal errors require independently verified issue, weight, dimensions and composition with alternative causes excluded. Source: Mint-error catalogue and grading guidance. Appearance alone does not distinguish a genuine mint error from plating, damage or counterfeit. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
