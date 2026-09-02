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
          "Modification changes loan terms; forbearance temporarily pauses/reduces payments; short sale involves sale for less than debt under negotiated conditions.",
        reference: "CFPB, mortgage loss-mitigation guidance.",
        limitations:
          "Eligibility, remaining liability, credit and tax consequences depend on actual agreements and law.",
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
      text: "Modification changes loan terms; forbearance temporarily pauses/reduces payments; short sale involves sale for less than debt under negotiated conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/loss-mitigation-modification-forbearance-short-sale-taxonomy",
  title: "Loss Mitigation Modification Forbearance Short Sale Taxonomy",
  description:
    "Bounded offline reference: Modification changes loan terms; forbearance temporarily pauses/reduces payments; short sale involves sale for less than debt under negotiated conditions. Source: CFPB, mortgage loss-mitigation guidance. Eligibility, remaining liability, credit and tax consequences depend on actual agreements and law. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
