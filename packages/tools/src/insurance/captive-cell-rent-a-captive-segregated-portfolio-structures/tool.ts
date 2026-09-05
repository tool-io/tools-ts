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
          "Captive cells, rent-a-captive and segregated portfolio structures organize risk financing under jurisdiction-specific ownership and segregation rules.",
        reference: "IAIS, captive insurance materials.",
        limitations:
          "A cell label does not prove assets are legally insulated or a captive is licensed/solvent.",
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
      text: "Captive cells, rent-a-captive and segregated portfolio structures organize risk financing under jurisdiction-specific ownership and segregation rules.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/captive-cell-rent-a-captive-segregated-portfolio-structures",
  title: "Captive Cell Rent a Captive Segregated Portfolio Structures",
  description:
    "Bounded offline reference: Captive cells, rent-a-captive and segregated portfolio structures organize risk financing under jurisdiction-specific ownership and segregation rules. Source: IAIS, captive insurance materials. A cell label does not prove assets are legally insulated or a captive is licensed/solvent. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
