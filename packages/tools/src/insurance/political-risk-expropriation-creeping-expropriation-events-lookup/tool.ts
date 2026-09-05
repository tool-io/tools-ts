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
          "Political-risk cover can distinguish direct expropriation from cumulative measures described as creeping expropriation.",
        reference: "MIGA, political-risk product definitions; policy wording.",
        limitations:
          "Actual insured events, waiting periods and exclusions require contract/jurisdiction review.",
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
      text: "Political-risk cover can distinguish direct expropriation from cumulative measures described as creeping expropriation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/political-risk-expropriation-creeping-expropriation-events-lookup",
  title: "Political Risk Expropriation Creeping Expropriation Events Lookup",
  description:
    "Bounded offline reference: Political-risk cover can distinguish direct expropriation from cumulative measures described as creeping expropriation. Source: MIGA, political-risk product definitions; policy wording. Actual insured events, waiting periods and exclusions require contract/jurisdiction review. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
