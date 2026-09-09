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
          "Global Trends 2040:A More Contested World is the NIC2021edition; it uses structural forces, emerging dynamics and scenarios. NTA is not an established edition title here.",
        reference: "USNIC, Global Trends 2040:A More Contested World 2021.",
        limitations:
          "Corrected title; historical framework not a verified prediction of 2040.",
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
      text: "Global Trends 2040:A More Contested World is the NIC2021edition; it uses structural forces, emerging dynamics and scenarios. NTA is not an established edition title here.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/nic-global-trends-nta-2040-edition-evolution-history",
  title: "NIC Global TrendsNTA 2040 Edition Evolution History",
  description:
    "Bounded offline reference: Global Trends 2040:A More Contested World is the NIC2021edition; it uses structural forces, emerging dynamics and scenarios. NTA is not an established edition title here. Source: USNIC, Global Trends 2040:A More Contested World 2021. Corrected title; historical framework not a verified prediction of 2040. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
