import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, wrap } from "../batch45-shared.js";
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
          "OCIP and CCIP wrap-ups are project/program insurance arrangements controlled by owner or contractor respectively.",
        reference: "Construction wrap-up program documents.",
        limitations:
          "Covered parties, lines, duration and excluded activities require exact program verification.",
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
      text: "OCIP and CCIP wrap-ups are project/program insurance arrangements controlled by owner or contractor respectively.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/ocip-ccip-owner-controlled-wrap-up-program-structure-lookup",
  title: "OCIP CCIP Owner Controlled Wrap Up Program Structure Lookup",
  description:
    "Bounded offline reference: OCIP and CCIP wrap-ups are project/program insurance arrangements controlled by owner or contractor respectively. Source: Construction wrap-up program documents. Covered parties, lines, duration and excluded activities require exact program verification. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
