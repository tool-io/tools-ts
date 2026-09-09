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
          "Universal basic services emphasize accessible collectively provided essentials; universal basic income emphasizes unconditional cash, with proposals sometimes combined.",
        reference: "UBS/UBIpolicy literature.",
        limitations:
          "Costs, coverage and outcomes depend on actual design; no automatic superiority or current legal entitlement.",
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
      text: "Universal basic services emphasize accessible collectively provided essentials; universal basic income emphasizes unconditional cash, with proposals sometimes combined.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/universal-basic-services-versus-income-beyond-cash-debate",
  title: "Universal Basic Services Versus Income Beyond Cash Debate",
  description:
    "Bounded offline reference: Universal basic services emphasize accessible collectively provided essentials; universal basic income emphasizes unconditional cash, with proposals sometimes combined. Source: UBS/UBIpolicy literature. Costs, coverage and outcomes depend on actual design; no automatic superiority or current legal entitlement. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
