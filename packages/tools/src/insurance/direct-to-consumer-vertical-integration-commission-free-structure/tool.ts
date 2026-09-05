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
          "Direct-to-consumer distribution can reduce intermediary layers but still incurs acquisition, service and operating costs.",
        reference: "Insurance distribution literature.",
        limitations:
          "Commission-free does not imply no distribution cost, cheaper premiums or vertical ownership in every product.",
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
      text: "Direct-to-consumer distribution can reduce intermediary layers but still incurs acquisition, service and operating costs.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/direct-to-consumer-vertical-integration-commission-free-structure",
  title: "Direct to Consumer Vertical Integration Commission Free Structure",
  description:
    "Bounded offline reference: Direct-to-consumer distribution can reduce intermediary layers but still incurs acquisition, service and operating costs. Source: Insurance distribution literature. Commission-free does not imply no distribution cost, cheaper premiums or vertical ownership in every product. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
